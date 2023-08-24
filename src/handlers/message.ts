import { LIKE, DISLIKE } from '../constants';
import { createServer } from '../queries/create-server';
import { createUser } from '../queries/create-user';
import { getUserLocal } from '../queries/get-user-local';

export const processMessage = async (client: any, message: UserMessage, prisma: any) => {
	if (message.author.bot === true) return;
	// const currentChannel = client.channels.cache.get(message.channel.id);
	// currentChannel.send('' + message.attachments.first());

	const userExists = await getUserLocal(Number(message.author.id), Number(message.guild.id), prisma);
	if(!userExists) {
		await createServer(Number(message.channel.id), prisma);
		await createUser(Number(message.author.id), Number(message.guild.id), message.author.username, prisma);
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
