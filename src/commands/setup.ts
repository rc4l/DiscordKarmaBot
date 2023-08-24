import { CommandInteraction, Client } from 'discord.js';
import { Command } from '../constants';
import { interactionIsInDMs } from '../utils';

export const setup: Command = {
	name: 'setup',
	description: 'This will setup the bot within the current channel',
	run: async (client: Client, interaction: CommandInteraction) => {
		let content = '';
		if (interactionIsInDMs(interaction)) {
			content = 'Please run this command within a channel inside a server.';
		}
		else {
			content = 'This command is not yet implemented.';
		}

		await interaction.followUp({
			ephemeral: true,
			content,
		});
	},
};