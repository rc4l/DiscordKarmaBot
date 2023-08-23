import { generalizedUpsert } from '../queries/generalized-upsert';

export const createWorld = async (prisma: any) => {
	await generalizedUpsert({ modelName: 'world', uniqueId: 1, kvpArray: [], prisma });
};