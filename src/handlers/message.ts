import { LIKE, DISLIKE } from '../constants';
import { createUser } from '../queries/create-user';
import { getChannelSettings } from '../queries/get-channel-settings';
import { getUserLocal } from '../queries/get-user-local';
import { isValidEnvironment } from '../utils';

export const processMessage = async (client: any, message: UserMessage, prisma: any) => {
	if(message.author.bot) return;
	const v = await isValidEnvironment(Number(message.guild.id));
	if (v?.pointOfFailure) {
		client.channels.cache.get(message.channel.id).send(v.pointOfFailure + '\nIf you believe this to be an error, please report this as a bug at <https://github.com/rc4l/DiscordKarmaBot>');
		return;
	}

	const channelId = Number(message.channel.id);
	const serverId = Number(message.guild.id);
	const userId = Number(message.author.id);

	const all = [
		getUserLocal(userId, serverId, prisma),
		getChannelSettings(channelId, prisma),
	];
	const results = await Promise.all(all);
	const userExists = results[0];
	const isTextForbidden = results[1]?.settings?.isTextForbidden ?? false;

	if(isTextForbidden && !message.attachments.first()) {
		message.delete();
		return;
	}

	if(!userExists) {
		await createUser(userId, serverId, message.author.username, prisma);
	}

	if (message.attachments.first()) processInitialReactions(message);
};

const processInitialReactions = async (message: UserMessage) => {
	const preferredLike = determineEmoji('TODO', message.guild.emojis) ?? LIKE;
	const preferredDislike = determineEmoji('TODO', message.guild.emojis) ?? DISLIKE;
	await message.react(preferredLike);
	await message.react(preferredDislike);
};

const determineEmoji = (preferredEmojiName: string, emojis: Emojis) => {
	const e = emojis.cache.find((emoji: Emoji) => emoji.name === preferredEmojiName);
	if (e) return e.name;
	else return null;
};

interface Emojis {
	cache: Emoji[];
}

interface UserMessage {
    attachments: any;
	author: MessageAuthor;
	channel: Channel;
	guild: any;
	id: string;
	react(name: string): Promise<void>;
    delete(): Promise<void>;
}

interface Channel {
	id: string;
}

interface MessageAuthor {
	id: number;
	username: string;
	bot: boolean;
	discriminator: string;
	avatar: string;
	flags: object;
	lastMessageID: string;
	lastMessageChannelID: string;
}

interface Emoji {
	id: string;
	name: string;
	roles: [];
	user: object;
	requireColons: boolean;
	managed: boolean;
	animated: boolean;
	available: boolean;
}
