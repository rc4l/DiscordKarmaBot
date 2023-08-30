import { Client, Collection, MessageReaction, PartialMessageReaction, PartialUser, User } from 'discord.js';
import { REFRESH } from '../constants';
import { getServerSettings } from '../queries/get-server-settings';
import { numberExtractRegex, processInitialReactions } from '../utils';
import { registerMessage, dislikeAdd, likeAdd, likeRemove, dislikeRemove, RegisterMessageParams } from '../queries/register-message';
import { getMessageParams } from './message';


export const processReaction = async (client: Client, reaction: MessageReaction | PartialMessageReaction, added: boolean, user: User | PartialUser, prisma: any) => {
	if(reaction?.message?.author?.bot || user?.bot) return;
	let m = reaction?.message;
	if (!m) return;
	if (m.partial) m = await m.fetch();
	if (!m) return;

	const cache = m.reactions?.cache;
	if (!cache) return;

	const serverId = Number(m.guild?.id);
	if (!serverId) return;
	const serverSettings = await getServerSettings(serverId, prisma);
	if (!serverSettings) return;

	const likeReaction : string = serverSettings?.settings?.likeReaction;
	const dislikeReaction : string = serverSettings?.settings?.dislikeReaction;
	const likeEmojiExtraction = likeReaction?.match(numberExtractRegex)?.at(0) ?? likeReaction;
	const dislikeEmojiExtraction = dislikeReaction?.match(numberExtractRegex)?.at(0) ?? dislikeReaction;
	if (!likeEmojiExtraction?.length || !dislikeEmojiExtraction?.length) return;

	const params = await getMessageParams(Number(m.channel?.id), serverId, Number(m.author?.id), m);
	let r;
	if(reaction.partial) r = await reaction.fetch();
	else r = reaction;

	if (r?.emoji?.name === REFRESH && m.guild?.id) {
		await handleRefresh(cache, r, user, prisma);
		params.likeCount = Number(cache.get(likeEmojiExtraction)?.count) ?? 1;
		params.dislikeCount = Number(cache.get(dislikeEmojiExtraction)?.count) ?? 1;
		params.interactions = 1;
		cache.forEach((x : MessageReaction) => {
			if (params?.interactions) params.interactions += x.count;
		});
		params.interactions--;
		registerMessage(params, prisma);
		return;
	}
	else {
		params.likeCount = Number(cache.get(likeEmojiExtraction)?.count);
		params.dislikeCount = Number(cache.get(dislikeEmojiExtraction)?.count);
		params.interactions = 1;
		cache.forEach((x : MessageReaction) => {
			if (params?.interactions) params.interactions += x.count;
		});
		params.interactions--;
	}

	if(r?.emoji?.id) {
		const reactionEmojiExtraction = r?.emoji?.id?.match(numberExtractRegex);
		if (reactionEmojiExtraction?.length) {
			const reactionEmojiId = reactionEmojiExtraction[0];
			emojiSubmissionHandler(added, reactionEmojiId, dislikeEmojiExtraction, likeEmojiExtraction, params, prisma);
		}
	}
	else if (r?.emoji?.name) {
		const emojiName = r?.emoji?.name;
		emojiSubmissionHandler(added, emojiName, dislikeReaction, likeReaction, params, prisma);
	}
	return;

	// console.log(stringifyJSONWithBigIntSupport(reaction));
	// if (reaction?.emoji) console.log('Emoji ID: ' + reaction?.emojiId);
	// console.log("Count: " reaction.message.reactions.cache.get(reaction.emoji.name).count);
};

const emojiSubmissionHandler = (added: boolean, emojiStr: string, dislike: string, like: string, params: RegisterMessageParams, prisma: any) => {
	switch (added) {
		case true:
			if (emojiStr === like) {
				likeAdd(params, prisma);
			}
			else if (emojiStr === dislike) {
				dislikeAdd(params, prisma);
			}
			else {
				registerMessage(params, prisma);
			}
			break;
		default:
			if (emojiStr === like) {
				likeRemove(params, prisma);
			}
			else if (emojiStr === dislike) {
				dislikeRemove(params, prisma);
			}
			else {
				registerMessage(params, prisma);
			}
			break;
	}

};

const handleRefresh = async (cache: Collection<string, MessageReaction>, reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, prisma: any) => {
	let message = reaction.message;
	if (!reaction.message?.guild?.id) message = await reaction.message.fetch();
	const settings = await getServerSettings(Number(message?.guild?.id), prisma);
	await processInitialReactions(message, settings?.settings);
	const refreshReaction = await cache.find(x => x?.emoji?.name === REFRESH);
	if(refreshReaction) {
		await refreshReaction.users.remove(user.id);
	}
};