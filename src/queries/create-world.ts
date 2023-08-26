import { generalizedFindAndCreate } from './generalized-find-and-create';

export const createWorld = async (prisma: any) => {
	await generalizedFindAndCreate({ modelName: 'world', uniqueId: 1, kvpArray: [], prisma });
};