import { CommandInteraction, Client } from 'discord.js';
import { Command } from '../constants';

export const help: Command = {
	name: 'hello',
	description: 'Returns a greeting',
	run: async (client: Client, interaction: CommandInteraction) => {
		const content = 'Hello there!';

		await interaction.followUp({
			ephemeral: true,
			content,
		});
	},
};