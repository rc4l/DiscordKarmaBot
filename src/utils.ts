import { CommandInteraction, Message, PartialMessage } from 'discord.js';
import { getWorld } from './queries/get-world';
import { getServer } from './queries/get-server';
import { createWorld } from './queries/create-world';
import { createServer } from './queries/create-server';
import { prismaClient } from './entry';
import { getServerSettings } from './queries/get-server-settings';
import { registerServerSettings } from './queries/register-settings';
import { ServerSettings, defaultServerSettings } from './settings/configure';
import { DISLIKE, LIKE, NOT_REGISTERED_MESSAGE } from './constants';

export const stringifyJSONWithBigIntSupport = (obj: any) => {
	return JSON.stringify(obj, (key, value) =>
		typeof value === 'bigint'
			? value.toString()
			: value, 2);
};

export const interactionIsInDMs = (interaction: CommandInteraction) => {
	return !interaction.guildId;
};

export const checkAndSetupWorldAndServer = async (serverId: number) => {
	let we, se, ss;
	try {
		we = await getWorld(prismaClient);
		se = await getServer(serverId, prismaClient);
		ss = await getServerSettings(serverId, prismaClient);
	}
	catch (err) {
		console.log(err);
	}
	if (!we) we = await createWorld(prismaClient);
	if (!se) se = await createServer(serverId, prismaClient);
	if (!ss) ss = await registerServerSettings({ ...defaultServerSettings }, { serverId, lastKnownName:'?' }, prismaClient);

	return we && se && ss;
};

// TODO: Cache this function per server.
export const isValidEnvironment = async (serverId: number) => {
	const all = [
		await getWorld(prismaClient),
		await getServer(serverId, prismaClient),
		await getServerSettings(serverId, prismaClient),
	];
	const results = await Promise.all(all);
	if (!results[0]) {return { pointOfFailure: 'World environment not setup. This is a global issue.' };}
	else if (!results[1]) {return { pointOfFailure: NOT_REGISTERED_MESSAGE };}
	else if (!results[2]) {return { pointOfFailure: NOT_REGISTERED_MESSAGE };}

	return {};
};

export const getSingleNestedObjectChanges = (obj1: any, obj2: any) => {
	let changes = '';
	for(const [key, value] of Object.entries(obj2)) {
		if (value && typeof value == 'object') {
			for(const [subKey, subValue] of Object.entries(value)) {
				if(subValue !== obj1[key][subKey]) {
					changes += `${key}.${subKey}: ${obj1[key][subKey]} -> ${subValue}\n`;
				}
			}
		}
		else if(value !== obj1[key]) {
			changes += `${key}: ${obj1[key]} -> ${value}\n`;
		}
	}
	if (changes === '') {
		changes = 'No changes detected.';
	}
	return changes;
};


export const processInitialReactions = async (message: Message | PartialMessage, settings: ServerSettings) => {
	const likeReaction = settings?.likeReaction ?? LIKE;
	const dislikeReaction = settings?.dislikeReaction ?? DISLIKE;

	const preferredLike = determineEmoji(likeReaction, message?.guild?.emojis) ?? LIKE;
	const preferredDislike = determineEmoji(dislikeReaction, message?.guild?.emojis) ?? DISLIKE;
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
	try {
		await message.react(preferredLike);
		await message.react(preferredDislike);
	}
	catch (err) {
		console.log(err);
		return;
	}
};

const emojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
export const numberExtractRegex = /(\d+)(?!.*\d)/g;
const determineEmoji = (preferredEmojiName: string, emojis: any) => {
	let e = null;

	// Leave if nothing is defined in the format we expect.
	if (!preferredEmojiName || !String(preferredEmojiName) || !emojis) return null;
	// console.log(preferredEmojiName.match(numberExtractRegex));

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