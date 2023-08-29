import { Message, PartialMessage } from 'discord.js';
import { createUser } from '../queries/create-user';
import { getChannelSettings } from '../queries/get-channel-settings';
import { getServerSettings } from '../queries/get-server-settings';
import { getUserLocal } from '../queries/get-user-local';
import { isValidEnvironment, processInitialReactions } from '../utils';

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
	const isTextForbidden = results[1]?.settings?.isTextForbidden ?? false;
	const allowEmbedReactions = Number(results[2]?.settings?.allowEmbedReactions ?? 0);

	// console.log(message?.embeds[0]?.data);
	let shouldDelete = isTextForbidden && !message.attachments.first();
	if(message?.embeds?.length) {
		switch(allowEmbedReactions) {
			case 1:
				shouldDelete = false;
				break;
			case 2:
				if(message?.embeds[0]?.data?.video) shouldDelete = false;
				else shouldDelete = true;
				break;
			case 3:
				if(message?.embeds[0]?.data?.thumbnail) shouldDelete = false;
				else shouldDelete = true;
				break;
			default:
				shouldDelete = true;
				break;
		}
	}
	if(shouldDelete) {
		message.delete();
		return;
	}

	if(!userExists && message?.author?.username) {
		await createUser(userId, serverId, message?.author?.username, prisma);
	}
	processInitialReactions(message, results[2]?.settings);
};
