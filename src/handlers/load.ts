import { createWorld } from '../queries/create-world';

export const processLoad = async (prisma: any) => {
	await createWorld(prisma);
};