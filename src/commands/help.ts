import { CommandInteraction, Client } from 'discord.js';
import { Command } from '../constants';
import { StringifyJSONWithBigIntSupport } from '../utils';
export const TEXT = 'Please visit https://github.com/rc4l/DiscordKarmaBot for more information.';

export const help: Command = {
	name: 'help',
	description: 'Need help setting up? Run this.',
	run: async (client: Client, interaction: CommandInteraction) => {
		const content = TEXT + '\n' + StringifyJSONWithBigIntSupport(interaction);
		await interaction.followUp({
			ephemeral: true,
			content,
		});
	},
};