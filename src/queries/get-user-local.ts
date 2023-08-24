import { generalizedFindById } from './generalized-find-by-id';

// Must be ran after server creation
export const getUserLocal = async (userId: number, serverId: number, prisma: any) => {
	return await generalizedFindById({ modelName: 'localUser', kvpArray: [{ k:'id', v:serverId }, { k: 'worldUserId', v:userId }], prisma });
};
