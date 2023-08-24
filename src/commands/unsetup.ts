import { CommandInteraction, Client } from 'discord.js';
import { Command } from '../constants';
import { interactionIsInDMs } from '../utils';

export const unsetup: Command = {
	name: 'unsetup',
	description: 'Will no longer add reactions to content posted in this channel.',
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