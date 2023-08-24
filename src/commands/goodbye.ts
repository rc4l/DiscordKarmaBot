import { CommandInteraction, Client } from 'discord.js';
import { Command } from '../constants';

export const goodbye: Command = {
	name: 'goodbye',
	description: 'Returns a farewell',
	run: async (client: Client, interaction: CommandInteraction) => {
		const content = 'Bye!';

		await interaction.followUp({
			ephemeral: true,
			content,
		});
	},
};