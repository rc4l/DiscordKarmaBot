import { generalizedFindById } from './generalized-find-by-id';

// Must be ran after server creation
export const getServerSettings = async (serverId: number, prisma: any) => {
	return await generalizedFindById({ modelName: 'serverSettings', kvpArray: [{ k:'id', v:serverId }], prisma });
};
