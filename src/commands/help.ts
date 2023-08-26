import { CommandInteraction, Client } from 'discord.js';
import { Command } from '../constants';
import { interactionIsInDMs, isValidEnvironment } from '../utils';
const FOLLOW_UP_TEXT = 'Please visit https://github.com/rc4l/DiscordKarmaBot for more information.';


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
			content = 'Please run /setupserver first.';
		}
		content += FOLLOW_UP_TEXT;
		await interaction.followUp({
			ephemeral: true,
			content,
		});
	},
};