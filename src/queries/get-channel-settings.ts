import { generalizedFindById } from './generalized-find-by-id';

// Must be ran after server creation
export const getChannelSettings = async (channelId: number, prisma: any) => {
	return await generalizedFindById({ modelName: 'channelSettings', kvpArray: [{ k:'id', v:channelId }], prisma });
};
