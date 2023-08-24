import { CommandInteraction } from 'discord.js';

export const StringifyJSONWithBigIntSupport = (obj: any) => {
	return JSON.stringify(obj, (key, value) =>
		typeof value === 'bigint'
			? value.toString()
			: value, 2);
};

export const interactionIsInDMs = (interaction: CommandInteraction) => {
	return !interaction.guildId;
};