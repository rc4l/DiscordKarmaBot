import { kvp } from '../constants';
import { generalizedUpsertSpecial } from './generalized-upsert';

export const registerMessage = async (params: RegisterMessageParams, prisma: any) => {
	const { channelName, content, dislikeCount, interactions, likeCount, messageId, serverName, userName } = params;
	const kvpArrayCreate : kvp[] = await getDefaultKvp(params);
	if (channelName) kvpArrayCreate.push({ k:'channelName', v: channelName });
	if (serverName) kvpArrayCreate.push({ k:'serverName', v: serverName });
	if (userName) kvpArrayCreate.push({ k:'userName', v: userName });
	kvpArrayCreate.push({ k:'likeCount', v: 1 });
	kvpArrayCreate.push({ k:'dislikeCount', v: 1 });
	kvpArrayCreate.push({ k:'interactions', v: 2 });
	if (content) kvpArrayCreate.push({ k:'content', v: content });

	const kvpArrayUpdate : kvp[] = await getDefaultKvp(params);
	if (likeCount) kvpArrayUpdate.push({ k:'likeCount', v: likeCount });
	if (dislikeCount) kvpArrayUpdate.push({ k:'dislikeCount', v: dislikeCount });
	if (interactions) kvpArrayUpdate.push({ k:'interactions', v: interactions });

	return await generalizedUpsertSpecial({ modelName: 'message', uniqueId: messageId, kvpArrayCreate, kvpArrayUpdate, prisma });
};

export const likeAdd = async (params: RegisterMessageParams, prisma: any) => {
	const { channelName, content, dislikeCount, interactions, likeCount, messageId, serverName, userName } = params;
	const kvpArrayCreate : kvp[] = await getDefaultKvp(params);
	if (channelName) kvpArrayCreate.push({ k:'channelName', v: channelName });
	if (serverName) kvpArrayCreate.push({ k:'serverName', v: serverName });
	if (userName) kvpArrayCreate.push({ k:'userName', v: userName });
	if (likeCount) kvpArrayCreate.push({ k:'likeCount', v: likeCount });
	if (dislikeCount) kvpArrayCreate.push({ k:'dislikeCount', v: dislikeCount });
	if (interactions) kvpArrayCreate.push({ k:'interactions', v: interactions });
	if (content) kvpArrayCreate.push({ k:'content', v: content });

	const kvpArrayUpdate : kvp[] = await getDefaultKvp(params);
	kvpArrayUpdate.push({ k:'interactions', v: interactions });
	kvpArrayUpdate.push({ k:'likeCount', v: { increment: 1 } });

	return await generalizedUpsertSpecial({ modelName: 'message', uniqueId: messageId, kvpArrayCreate, kvpArrayUpdate, prisma });
};

export const dislikeAdd = async (params: RegisterMessageParams, prisma: any) => {
	const { channelName, content, dislikeCount, interactions, likeCount, messageId, serverName, userName } = params;
	const kvpArrayCreate : kvp[] = await getDefaultKvp(params);
	if (channelName) kvpArrayCreate.push({ k:'channelName', v: channelName });
	if (serverName) kvpArrayCreate.push({ k:'serverName', v: serverName });
	if (userName) kvpArrayCreate.push({ k:'userName', v: userName });
	if (likeCount) kvpArrayCreate.push({ k:'likeCount', v: likeCount });
	if (dislikeCount) kvpArrayCreate.push({ k:'dislikeCount', v: dislikeCount });
	if (interactions) kvpArrayCreate.push({ k:'interactions', v: interactions });
	if (content) kvpArrayCreate.push({ k:'content', v: content });

	const kvpArrayUpdate : kvp[] = await getDefaultKvp(params);
	kvpArrayUpdate.push({ k:'interactions', v: interactions });
	kvpArrayUpdate.push({ k:'dislikeCount', v: { increment: 1 } });

	return await generalizedUpsertSpecial({ modelName: 'message', uniqueId: messageId, kvpArrayCreate, kvpArrayUpdate, prisma });
};

export const likeRemove = async (params: RegisterMessageParams, prisma: any) => {
	const { channelName, content, dislikeCount, interactions, likeCount, messageId, serverName, userName } = params;
	const kvpArrayCreate : kvp[] = await getDefaultKvp(params);
	if (channelName) kvpArrayCreate.push({ k:'channelName', v: channelName });
	if (serverName) kvpArrayCreate.push({ k:'serverName', v: serverName });
	if (userName) kvpArrayCreate.push({ k:'userName', v: userName });
	if (likeCount) kvpArrayCreate.push({ k:'likeCount', v: likeCount });
	if (dislikeCount) kvpArrayCreate.push({ k:'dislikeCount', v: dislikeCount });
	if (interactions) kvpArrayCreate.push({ k:'interactions', v: interactions });
	if (content) kvpArrayCreate.push({ k:'content', v: content });

	const kvpArrayUpdate : kvp[] = await getDefaultKvp(params);
	kvpArrayUpdate.push({ k:'interactions', v: interactions });
	kvpArrayUpdate.push({ k:'likeCount', v: { decrement: 1 } });

	return await generalizedUpsertSpecial({ modelName: 'message', uniqueId: messageId, kvpArrayCreate, kvpArrayUpdate, prisma });
};
export const dislikeRemove = async (params: RegisterMessageParams, prisma: any) => {
	const { channelName, content, dislikeCount, interactions, likeCount, messageId, serverName, userName } = params;
	const kvpArrayCreate : kvp[] = await getDefaultKvp(params);
	if (channelName) kvpArrayCreate.push({ k:'channelName', v: channelName });
	if (serverName) kvpArrayCreate.push({ k:'serverName', v: serverName });
	if (userName) kvpArrayCreate.push({ k:'userName', v: userName });
	if (likeCount) kvpArrayCreate.push({ k:'likeCount', v: likeCount });
	if (dislikeCount) kvpArrayCreate.push({ k:'dislikeCount', v: dislikeCount });
	if (interactions) kvpArrayCreate.push({ k:'interactions', v: interactions });
	if (content) kvpArrayCreate.push({ k:'content', v: content });

	const kvpArrayUpdate : kvp[] = await getDefaultKvp(params);
	kvpArrayUpdate.push({ k:'interactions', v: interactions });
	kvpArrayUpdate.push({ k:'dislikeCount', v: { decrement: 1 } });

	return await generalizedUpsertSpecial({ modelName: 'message', uniqueId: messageId, kvpArrayCreate, kvpArrayUpdate, prisma });
};

const getDefaultKvp = async (params: RegisterMessageParams) => {
	const { channelId, serverId, userId } = params;
	const kvpArray = [
		{ k:'worldUserId', v: userId },
		{ k:'serverId', v: serverId },
		{ k:'channelId', v: channelId }];
	return kvpArray;
};


export interface InteractMessageParams {
    channelId: number;
    messageId: number;
    serverId: number;
    userId: number;
    channelName?: string;
    serverName?: string;
    userName?: string;
}

export interface RegisterMessageParams extends InteractMessageParams {
    channelId: number;
    channelName?: string;
    content: any;
    dislikeCount?: number;
    likeCount?: number;
    messageId: number;
    serverId: number;
    serverName?: string;
    userId: number;
    userName?: string;
    interactions?: number;
}

