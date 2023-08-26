import { generalizedFindAndCreate } from './generalized-find-and-create';
import { generalizedUpdate } from './generalized-update';

export const createServer = async (serverId: number, prisma: any) => {
	const sid = Number(serverId);
	// Initial creations...
	let all = [
		generalizedFindAndCreate({ modelName: 'server', uniqueId: sid, kvpArray: [{ k: 'world', v: { connect: { id: 1 } } }], prisma }),
		// generalizedFindAndCreate({ modelName: 'serverSettings', uniqueId: sid, kvpArray: [], prisma }),
	];
	let results = await Promise.all(all);
	for (const r of results) {
		if (!r) return null;
	}

	// Update relations
	all = [
		generalizedUpdate({ modelName: 'world', uniqueId: 1, kvpArray: [{ k: 'servers', v: { connect: { id: sid } } }], prisma }),
		// generalizedFindAndCreate({ modelName: 'server', uniqueId: sid, kvpArray: [{ k: 'settings', v: { connect: { id: sid } } }], prisma }),
	];
	results = await Promise.all(all);
	for (const r of results) {
		if (!r) return null;
	}
	return true;
};

