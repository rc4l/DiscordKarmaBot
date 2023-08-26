import { Client } from 'discord.js';
import { Commands } from '../constants';
import { isValidEnvironment } from '../utils';

export const processCommand = async (client: Client, interaction: any) => {
	const slashCommand = Commands.find(c => c.name === interaction.commandName);
	if (!slashCommand) {
		interaction.followUp({ content: 'An error has occurred' });
		return;
	}

	let ve;
	switch (interaction.commandName) {
		case 'help': // Help command is always available.
			await interaction.deferReply();
			slashCommand.run(client, interaction);
			break;
		case 'setupserver': // Setup server command is available, and also checks within the command if we're inside a valid channel on the server.
			await interaction.deferReply();
			slashCommand.run(client, interaction);
			break;
		default: // All other commands are only available if we're in a valid environment, which requires setupserver to run.
			ve = await isValidEnvironment(interaction.guildId);
			if (ve) {
				await interaction.deferReply();
				interaction.followUp({ content: 'Environment validation failed. Please report this to https://github.com/rc4l/DiscordKarmaBot' });
				return;
			}
			await interaction.deferReply();
			slashCommand.run(client, interaction);
			break;
	}
};