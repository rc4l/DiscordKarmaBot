import { CommandInteraction, Client } from 'discord.js';
import { Command, HELP_MESSAGE, NOT_REGISTERED_MESSAGE } from '../constants';
import { interactionIsInDMs, isValidEnvironment } from '../utils';
const FOLLOW_UP_TEXT = 'Visit https://github.com/rc4l/DiscordKarmaBot for more information.';


export const help: Command = {
	name: 'help',
	description: 'Need help setting up? Run this.',
	run: async (client: Client, interaction: CommandInteraction) => {
		if (interactionIsInDMs(interaction)) {
			await interaction.followUp({
				ephemeral: true,
				content: 'Please run this command within a channel inside a server. ' + FOLLOW_UP_TEXT,
			});
		}

		let content = '';
		const ve = await isValidEnvironment(Number(interaction.guildId));
		if(ve?.pointOfFailure) {
			content = NOT_REGISTERED_MESSAGE;
		}
		else {
			content = HELP_MESSAGE;
		}
		await interaction.followUp({
			ephemeral: true,
			content,
		});
	},
};