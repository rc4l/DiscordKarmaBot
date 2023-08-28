import { DISLIKE, LIKE } from '../constants';
import { createUser } from '../queries/create-user';
import { getChannelSettings } from '../queries/get-channel-settings';
import { getServerSettings } from '../queries/get-server-settings';
import { getUserLocal } from '../queries/get-user-local';
import { ServerSettings } from '../settings/configure';
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
		getServerSettings(serverId, prisma),
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

	if (message.attachments.first()) processInitialReactions(message, results[2]?.settings);
};

const processInitialReactions = async (message: UserMessage, settings: ServerSettings) => {
	const likeReaction = settings?.likeReaction ?? LIKE;
	const dislikeReaction = settings?.dislikeReaction ?? DISLIKE;

	const preferredLike = determineEmoji(likeReaction, message.guild.emojis) ?? LIKE;
	const preferredDislike = determineEmoji(dislikeReaction, message.guild.emojis) ?? DISLIKE;
	await message.react(preferredLike);
	await message.react(preferredDislike);
};

const emojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
const numberExtractRegex = /\d+/g;
const determineEmoji = (preferredEmojiName: string, emojis: any) => {
	let e = null;

	// Leave if nothing is defined in the format we expect.
	if (!preferredEmojiName || !String(preferredEmojiName) || !emojis) return null;
	console.log(preferredEmojiName.match(numberExtractRegex));

	// Unicode Emoji
	if(emojiRegex.test(preferredEmojiName)) {
		e = preferredEmojiName;
	}

	// Custom Emoji
	else if (!emojiRegex.test(preferredEmojiName)) {
		const numExists = preferredEmojiName.match(numberExtractRegex);
		if (numExists && emojis.cache.get(numExists[0])) e = numExists[0];
	}
	return e;
};


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