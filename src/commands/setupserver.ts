import { CommandInteraction, Client } from 'discord.js';
import { Command } from '../constants';
import { checkAndSetupWorldAndServer, interactionIsInDMs, stringifyJSONWithBigIntSupport } from '../utils';
import { defaultServerSettings } from '../settings/configure';
import { getServerSettings } from '../queries/get-server-settings';
import { prismaClient } from '../entry';
import { registerServerSettings } from '../queries/register-settings';

export const setupserver: Command = {
	name: 'setupserver',
	options: [],
	description: 'Use this to modify server settings.',
	run: async (client: Client, interaction: CommandInteraction) => {
		let content = '';
		if (interactionIsInDMs(interaction)) {
			content = 'Please run this command within a channel inside a server.';
			await interaction.followUp({
				ephemeral: true,
				content,
			});
		}


		const serverId = Number(interaction.guildId);
		await checkAndSetupWorldAndServer(serverId);
		const currentSettings = (await getServerSettings(serverId, prismaClient))?.settings || {};
		const updatedSettings = { ...defaultServerSettings, ...currentSettings };
		await registerServerSettings(updatedSettings, serverId, prismaClient);
		content = stringifyJSONWithBigIntSupport((await getServerSettings(serverId, prismaClient))?.settings);

		await interaction.followUp({
			ephemeral: true,
			content,
		});
	},
};