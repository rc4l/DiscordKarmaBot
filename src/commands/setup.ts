import { CommandInteraction, Client, ApplicationCommandOptionData, ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../constants';
import { interactionIsInDMs } from '../utils';

const options: ApplicationCommandOptionData[] = [
	{
		type: ApplicationCommandOptionType.Boolean,
		name: 'do not allow text',
		description: 'Will automatically delete any messages that don\'t at least contain an image/video/embed.',
	},
];

export const setup: Command = {
	name: 'setup',
	options: options,
	description: 'This will setup the bot within the current channel and automatically add reactions to content posted in this channel.',
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