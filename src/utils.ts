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
	if (!results[0]) {return { pointOfFailure: 'World environment not setup. This is a global issue.' };}
	else if (!results[1]) {return { pointOfFailure: `Server environment for ${serverId} not setup. This is an issue with your server (did you run setupserver first?)` };}
	else if (!results[2]) {return { pointOfFailure: `Server settings for ${serverId} not setup. This is an issue with your server (did you run setupserver first?)` };}

	return {};
};

export const getSingleNestedObjectChanges = (obj1: any, obj2: any) => {
	let changes = '';
	for(const [key, value] of Object.entries(obj2)) {
		if (value === Object) {
			for(const [subKey, subValue] of Object.entries(value)) {
				if(subValue !== obj1[key][subKey]) {
					changes += `${key}.${subKey}: ${obj1[key][subKey]} -> ${subValue}\n`;
				}
			}
		}
		else if(value !== obj1[key]) {
			changes += `${key}: ${obj1[key]} -> ${value}\n`;
		}
	}
	if (changes === '') {
		changes = 'No changes detected.';
	}
	return changes;
};