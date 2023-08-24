import { Client } from 'discord.js';
import { Commands } from '../constants';

export const processCommand = async (client: Client, interaction: any) => {
	const slashCommand = Commands.find(c => c.name === interaction.commandName);
	if (!slashCommand) {
		interaction.followUp({ content: 'An error has occurred' });
		return;
	}

	await interaction.deferReply();
	slashCommand.run(client, interaction);
};