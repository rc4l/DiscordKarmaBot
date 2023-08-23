import { generalizedUpsert } from './generalized-upsert';
import { generalizedUpdate } from './generalized-update';

export const getOrCreateUser = async (userId: number, serverId: number, username: string, prisma: any) => {
	const uid = Number(userId);
	const sid = Number(serverId);

	// Initial creations...
	let all = [
		generalizedUpsert({ modelName: 'worldUser', uniqueId: uid, kvpArray: [{ k: 'lastKnownName', v: username }, { k: 'world', v: { connect: { id: 1 } } }], prisma }),
		generalizedUpsert({ modelName: 'server', uniqueId: sid, kvpArray: [{ k: 'world', v: { connect: { id: 1 } } }], prisma }),
		generalizedUpsert({ modelName: 'localUser', uniqueId: sid, kvpArray: [], prisma }),
	];
	let results = await Promise.all(all);
	for (const r of results) {
		if (!r) return null;
	}

	// Update relations

	all = [
		generalizedUpdate({ modelName: 'world', uniqueId: 1, kvpArray: [{ k: 'users', v: { connect: { id: uid } } }, { k: 'servers', v: { connect: { id: sid } } }], prisma }),
		generalizedUpdate({ modelName: 'server', uniqueId: sid, kvpArray: [{ k: 'users', v: { connect: { id: sid } } }], prisma }),
		generalizedUpdate({ modelName: 'worldUser', uniqueId: uid, kvpArray: [{ k: 'localUsers', v: { connect: { id: sid } } }], prisma }),
		generalizedUpdate({ modelName: 'localUser', uniqueId: sid, kvpArray: [{ k: 'server', v: { connect: { id: sid } } }, { k: 'worldUser', v: { connect: { id: uid } } }], prisma }),
	];
	results = await Promise.all(all);
	for (const r of results) {
		if (!r) return null;
	}
	return true;
};
