import { createWorld } from '../queries/create-world';
import { Client } from 'discord.js';

export const processLoad = async (client: Client, prisma: any) => {
	await createWorld(prisma);
};