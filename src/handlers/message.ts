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

	if(isTextForbidden && !message.attachments.first()) {
		message.delete();
		return;
	}

	if(!userExists && message?.author?.username) {
		await createUser(userId, serverId, message?.author?.username, prisma);
	}

	if (message.attachments.first()) processInitialReactions(message, results[2]?.settings);
};
