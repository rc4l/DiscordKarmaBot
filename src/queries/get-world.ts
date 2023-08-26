import { generalizedFindById } from './generalized-find-by-id';

// Must be ran after server creation
export const getWorld = async (prisma: any) => {
	return await generalizedFindById({ modelName: 'world', kvpArray: [{ k:'id', v:1 }], prisma });
};
