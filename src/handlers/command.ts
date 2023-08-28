import { Client } from 'discord.js';
import { Commands } from '../constants';
import { isValidEnvironment } from '../utils';
import { PermissionsBitField } from 'discord.js';

export const processCommand = async (client: Client, interaction: any) => {
	await interaction.deferReply();
	const slashCommand = Commands.find(c => c.name === interaction.commandName);
	if (!slashCommand) {
		interaction.followUp({ content: `An error has occurred; command: ${interaction.commandName} does not exist.` + '\nIf you believe this to be an error, please report this as a bug at https://github.com/rc4l/DiscordKarmaBot' });
		return;
	}
	else if (!interaction?.member?.permissions?.has(PermissionsBitField.Flags.ManageGuild)) {
		interaction.followUp({ content: 'You need admin permissions to manage this bot.' + '\nIf you believe this to be an error, please report this as a bug at https://github.com/rc4l/DiscordKarmaBot' });
		return;
	}


	let ve;
	switch (interaction.commandName) {
		case 'help': // Help command is always available.
			slashCommand.run(client, interaction);
			break;
		case 'setupserver': // Setup server command is available, and also checks within the command if we're inside a valid channel on the server.
			slashCommand.run(client, interaction);
			break;
		default: // All other commands are only available if we're in a valid environment, which requires setupserver to run.
			ve = await isValidEnvironment(Number(interaction.guildId));
			if (ve?.pointOfFailure) {
				interaction.followUp({ content: ve.pointOfFailure + '\nIf you believe this to be an error, please report this as a bug at https://github.com/rc4l/DiscordKarmaBot' });
				return;
			}
			slashCommand.run(client, interaction);
			break;
	}
};