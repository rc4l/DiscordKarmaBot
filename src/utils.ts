import { CommandInteraction } from 'discord.js';
import { getWorld } from './queries/get-world';
import { getServer } from './queries/get-server';
import { createWorld } from './queries/create-world';
import { createServer } from './queries/create-server';
import { prismaClient } from './entry';
import { getServerSettings } from './queries/get-server-settings';
import { registerServerSettings } from './queries/register-settings';
import { defaultServerSettings } from './settings/configure';

export const stringifyJSONWithBigIntSupport = (obj: any) => {
	return JSON.stringify(obj, (key, value) =>
		typeof value === 'bigint'
			? value.toString()
			: value, 2);
};

export const interactionIsInDMs = (interaction: CommandInteraction) => {
	return !interaction.guildId;
};

export const checkAndSetupWorldAndServer = async (serverId: number) => {
	let we, se, ss;
	try {
		we = await getWorld(prismaClient);
		se = await getServer(serverId, prismaClient);
		ss = await getServerSettings(serverId, prismaClient);
	}
	catch (err) {
		console.log(err);
	}
	if (!we) we = await createWorld(prismaClient);
	if (!se) se = await createServer(serverId, prismaClient);
	if (!ss) ss = await registerServerSettings({ ...defaultServerSettings }, serverId, prismaClient);

	return we && se && ss;
};

// TODO: Cache this function per server.
export const isValidEnvironment = async (serverId: number) => {
	const all = [
		await getWorld(prismaClient),
		await getServer(serverId, prismaClient),
		await getServerSettings(serverId, prismaClient),
	];
	const results = await Promise.all(all);
	for (const r of results) {
		if (!r) {
			console.log('Environment not setup for server: ' + serverId);
			return null;
		}
	}

	return true;
};