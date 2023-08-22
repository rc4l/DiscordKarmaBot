import { generalizedCreate } from './generalized-create';
import { generalizedGet } from './generalized-get';
import { generalizedConnect } from './generalized-connect';
import { generalizedFindAndOrCreate } from './generalized-find-and-or-create';

export const getOrCreateUser = async (userId: number, serverId: number, username: string, prisma: any) => {
	const uid = Number(userId);
	const sid = Number(serverId);

	// Initial creations...
	const all = [
		generalizedFindAndOrCreate({ modelName: 'world', uniqueId: 1, kvpArray: [{ k: 'users', v: {} }, { k: 'servers', v: {} }], prisma }),
		generalizedFindAndOrCreate({ modelName: 'worldUser', uniqueId: uid, kvpArray: [{ k: 'lastKnownName', v: username }, { k: 'world', v: {} }, { k: 'localUsers', v: {} }], prisma }),
		generalizedFindAndOrCreate({ modelName: 'server', uniqueId: sid, kvpArray: [{ k: 'world', v: {} }, { k: 'users', v: {} }], prisma }),
		generalizedFindAndOrCreate({ modelName: 'localUser', uniqueId: sid, kvpArray: [{ k: 'server', v: {} }, { k: 'worldUser', v: {} }], prisma }),
		// getOrCreate({ modelName: 'localUser', kvpArray: [{ k: 'id', v: sid }], prisma }),
	];
	const results = await Promise.all(all);
	for (const r of results) {
		if (!r) return null;
	}
	/*
	// Local User...
	all = [
		generalizedUpdate('localUser', uid, 'discordServerId', sid, prisma),
		generalizedUpdate('localUser', uid, 'worldUserId', uid, prisma),
	];
	results = await Promise.all(all);
	for (const r of results) {
		if (!r) return null;
	}

	all = [
		generalizedConnect('localUser', uid, 'server', sid, prisma),
		generalizedConnect('localUser', uid, 'worldUser', uid, prisma),
	];
	results = await Promise.all(all);
	for (const r of results) {
		if (!r) return null;
	}

	// World user...
	all = [
		generalizedUpdate('worldUser', uid, 'lastKnownName', username, prisma),
		generalizedUpdate('worldUser', uid, 'worldId', 1, prisma),
	];
	results = await Promise.all(all);
	for (const r of results) {
		if (!r) return null;
	}

	all = [
		generalizedConnect('worldUser', uid, 'localUsers', uid, prisma),
	];
	results = await Promise.all(all);
	for (const r of results) {
		if (!r) return null;
	}

	// Server updates...
	all = [
		generalizedUpdate('server', sid, 'worldId', 1, prisma),
	];
	results = await Promise.all(all);
	for (const r of results) {
		if (!r) return null;
	}

	all = [
		generalizedConnect('server', sid, 'world', 1, prisma),
		generalizedConnect('server', sid, 'users', uid, prisma),
	];
	results = await Promise.all(all);
	for (const r of results) {
		if (!r) return null;
	}

	// World updates...
	all = [
		generalizedConnect('world', 1, 'users', uid, prisma),
		generalizedConnect('world', 1, 'servers', sid, prisma),
	];
	results = await Promise.all(all);
	for (const r of results) {
		if (!r) return null;
	}*/

	return true;
};
