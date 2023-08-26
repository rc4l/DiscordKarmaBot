import { CommandInteraction, Client, ApplicationCommandOptionData, ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../constants';
import { interactionIsInDMs, stringifyJSONWithBigIntSupport } from '../utils';
import { prismaClient } from '../entry';
import { getChannelSettings } from '../queries/get-channel-settings';
import { defaultChannelSettings } from '../settings/configure';
import { registerChannelSettings } from '../queries/register-settings';

const options: ApplicationCommandOptionData[] = [
	{
		type: ApplicationCommandOptionType.Boolean,
		name: 'forbid-text',
		description: 'Will automatically delete any messages that don\'t at least contain an image/video/embed.',
	},
];

export const setupchannel: Command = {
	name: 'setupchannel',
	options: options,
	description: 'Use this to modify channel settings in the channel this is ran in.',
	run: async (client: Client, interaction: CommandInteraction) => {
		let content = '';
		if (interactionIsInDMs(interaction)) {
			content = 'Please run this command within a channel inside a server.';
			await interaction.followUp({
				ephemeral: true,
				content,
			});
		}

		const currentSettings = (await getChannelSettings(Number(interaction.channelId), prismaClient))?.settings || {};
		const updatedSettings = { ...defaultChannelSettings, ...currentSettings };
		await registerChannelSettings(updatedSettings, Number(interaction.channelId), Number(interaction.guildId), prismaClient);
		content = stringifyJSONWithBigIntSupport((await getChannelSettings(Number(interaction.channelId), prismaClient))?.settings);

		await interaction.followUp({
			ephemeral: true,
			content,
		});
	},
};