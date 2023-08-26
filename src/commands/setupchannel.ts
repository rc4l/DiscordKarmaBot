import { CommandInteraction, Client, ApplicationCommandOptionData, ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../constants';
import { interactionIsInDMs, getSingleNestedObjectChanges } from '../utils';
import { prismaClient } from '../entry';
import { getChannelSettings } from '../queries/get-channel-settings';
import { defaultChannelSettings } from '../settings/configure';
import { registerChannelSettings } from '../queries/register-settings';

const options: ApplicationCommandOptionData[] = [
	{
		type: ApplicationCommandOptionType.Boolean,
		name: 'forbid-text',
		description: 'Will automatically delete user messages that don\'t at least contain an image/video/embed.',
	},
	{
		type: ApplicationCommandOptionType.Boolean,
		name: 'disable-hall-of-fame',
		description: 'Content from this channel won\'t be sent to the hall of fame.',
	},
	{
		type: ApplicationCommandOptionType.Number,
		name: 'hall-of-fame-min-likes',
		description: 'Automatically sends content to hall of fame with this amount of likes. 0 to disable.',
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
		const forbidTextOption = await interaction.options.get('forbid-text')?.value;
		if (forbidTextOption !== undefined) updatedSettings.isTextForbidden = forbidTextOption === undefined ? updatedSettings.isTextForbidden : forbidTextOption;
		const disableHallOfFameOption = await interaction.options.get('disable-hall-of-fame')?.value;
		if (disableHallOfFameOption !== undefined) updatedSettings.dontSendToHallOfFame = disableHallOfFameOption === undefined ? updatedSettings.dontSendToHallOfFame : disableHallOfFameOption;
		const hallOfFameMinLikesOption = await interaction.options.get('hall-of-fame-min-likes')?.value;
		if (hallOfFameMinLikesOption !== undefined) updatedSettings.hallOfFameMinimumLikes = hallOfFameMinLikesOption === undefined ? updatedSettings.hallOfFameMinimumLikes : hallOfFameMinLikesOption;

		await registerChannelSettings(updatedSettings, Number(interaction.channelId), Number(interaction.guildId), prismaClient);

		await interaction.followUp({
			ephemeral: true,
			content: getSingleNestedObjectChanges(currentSettings, updatedSettings),
		});
	},
};