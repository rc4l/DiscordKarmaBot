import { Client, Message, MessageReaction, PartialMessageReaction, PartialUser, User } from 'discord.js';
import { stringifyJSONWithBigIntSupport } from '../utils';

export const processReaction = async (client: Client, reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {

	const cache = reaction?.message?.reactions?.cache;
	if (!cache) return;
	let r;
	if(reaction.partial) r = await reaction.fetch();
	else r = reaction;

	// console.log('@@@@@');
	// console.log(r.emoji);

	// if(r?.emoji?.id) { // If the emoji is a custom emoji, it will have an ID. If it's a unicode emoji, it won't.
	// 	console.log('Is custom emoji');
	// 	const c = cache.get(r?.emoji?.id)?.count;
	// 	console.log(cache.get(r?.emoji?.id));
	// 	console.log('Count: ' + c);
	// }
	// else if (r?.emoji?.name) {
	// 	console.log('Is unicode emoji');
	// 	const c = cache.get(r?.emoji?.name)?.count;
	// 	console.log(cache.get(r?.emoji?.name));
	// 	console.log('Count: ' + c);
	// }
	// else {
	// 	console.log('No emoji');
	// 	return;
	// }

	// / console.log(stringifyJSONWithBigIntSupport(reaction));
	// if (reaction?.emoji) console.log('Emoji ID: ' + reaction?.emojiId);
	// console.log("Count: " reaction.message.reactions.cache.get(reaction.emoji.name).count);
};