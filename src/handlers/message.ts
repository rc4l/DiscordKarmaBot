import { Attachment, Embed, Message, PartialMessage, TextChannel } from 'discord.js';
import { createUser } from '../queries/create-user';
import { getChannelSettings } from '../queries/get-channel-settings';
import { getServerSettings } from '../queries/get-server-settings';
import { getUserLocal } from '../queries/get-user-local';
import { isValidEnvironment, processInitialReactions } from '../utils';
import { RegisterMessageParams, registerMessage } from '../queries/register-message';

export const processMessage = async (client: any, m: Message | PartialMessage, prisma: any) => {
	let message = m;
	if(message?.author?.bot) return;
	if(!message?.guild?.id) message = await message.fetch();


	const v = await isValidEnvironment(Number(message?.guild?.id));
	if (v?.pointOfFailure) {
		client.channels.cache.get(message.channel.id).send(v.pointOfFailure + '\nIf you believe this to be an error, please report this as a bug at <https://github.com/rc4l/DiscordKarmaBot>');
		return;
	}

	const channelId = Number(message.channel.id);
	const serverId = Number(message?.guild?.id);
	const userId = Number(message?.author?.id);

	const all = [
		getUserLocal(userId, serverId, prisma),
		getChannelSettings(channelId, prisma),
		getServerSettings(serverId, prisma),
	];
	const results = await Promise.all(all);
	const userExists = results[0];
	const isTextForbidden = results[1]?.settings?.isTextForbidden ?? 0;
	const allowEmbedReactionsChannel = Number(results[1]?.settings?.allowEmbedReactions ?? 0) ?? 0;
	const allowEmbedReactionsServer = Number(results[2]?.settings?.allowEmbedReactions ?? 0) ?? 0;

	let isReactableEmbed = false;
	if (message?.embeds?.length) {
		switch(allowEmbedReactionsChannel) {
			case 1:
				isReactableEmbed = false;
				break;
			case 2:
				isReactableEmbed = true;
				break;
			case 3:
				if(message?.embeds[0]?.data?.video) isReactableEmbed = true;
				break;
			case 4:
				if(message?.embeds[0]?.data?.thumbnail) isReactableEmbed = false;
				break;
			default:
				switch(allowEmbedReactionsServer) {
					case 1:
						isReactableEmbed = true;
						break;
					case 2:
						if(message?.embeds[0]?.data?.video) isReactableEmbed = true;
						break;
					case 3:
						if(message?.embeds[0]?.data?.thumbnail) isReactableEmbed = false;
						break;
					default:
						break;
				}
				break;
		}
	}

	if(isTextForbidden && !isReactableEmbed && !message.attachments.first()) {
		message.delete();
		return;
	}

	if(!userExists && message?.author?.username) {
		await createUser(userId, serverId, message?.author?.username, prisma);
	}
	if (isReactableEmbed || message.attachments.first()) {
		await processInitialReactions(message, results[2]?.settings);
		registerMessage(getMessageParams(channelId, serverId, userId, message), prisma);
	}
};

export const getMessageParams = (channelId: number, serverId: number, userId: number, message: Message | PartialMessage) => {
	const content : Content = { data:[] };
	if (message?.embeds?.length) {
		message.embeds.forEach((embed: Embed) => {
			content.data.push({ url: String(embed?.url), title: String(embed?.title), contentType: String(embed?.video ? 'video' : '?') });
		});
	}
	if (message?.attachments?.first()) {
		message.attachments.forEach((attachment: Attachment) => {
			content.data.push({ url: String(attachment?.url), title: String(attachment?.name), contentType: String(attachment?.contentType) });
		});
	}
	const params : RegisterMessageParams = { channelId, content, dislikeCount: 1, likeCount: 1, interactions: 0, messageId: Number(message.id), serverId, userId };
	const channelName = (message?.channel as TextChannel)?.name;
	const serverName = message?.guild?.name;
	const userName = message?.author?.username;
	if (channelName) params.channelName = channelName;
	if (serverName) params.serverName = serverName;
	if (userName) params.userName = userName;
	return params;
};

interface Content {
    data: ContentEntry[]
}

interface ContentEntry {
    url: string,
    title? : string,
    contentType? : string,
}