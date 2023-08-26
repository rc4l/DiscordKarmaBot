import { LIKE, DISLIKE } from '../constants';
import { createUser } from '../queries/create-user';
import { getUserLocal } from '../queries/get-user-local';
import { isValidEnvironment } from '../utils';

export const processMessage = async (client: any, message: UserMessage, prisma: any) => {
	const v = await isValidEnvironment(Number(message.guild.id));
	if (message.author.bot === true || !v) {
		return;
	}
	// const currentChannel = client.channels.cache.get(message.channel.id);
	// currentChannel.send('' + message.attachments.first());

	const channelId = Number(message.channel.id);
	const serverId = Number(message.guild.id);
	const userId = Number(message.author.id);


	const userExists = await getUserLocal(userId, serverId, prisma);
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
	react: React;
}

interface React {
  (name: string): Promise<void>;
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
