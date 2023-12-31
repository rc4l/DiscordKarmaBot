import { CommandInteraction, Client, ApplicationCommandOptionData, ApplicationCommandOptionType, TextChannel } from 'discord.js';
import { Command } from '../constants';
import { interactionIsInDMs, getSingleNestedObjectChanges } from '../utils';
import { prismaClient } from '../entry';
import { getChannelSettings } from '../queries/get-channel-settings';
import { defaultChannelSettings } from '../settings/configure';
import { registerChannelSettings } from '../queries/register-settings';

const options: ApplicationCommandOptionData[] = [
	{
		type: ApplicationCommandOptionType.Integer,
		name: 'forbid-text',
		description: 'Customizeable message deletion for keeping channels clean.',
		choices: [
			{
				name: 'Allow anything to be posted',
				value: 0,
			},
			{
				name: 'Messages must contain content',
				value: 1,
			},
		],
	},
	{
		type: ApplicationCommandOptionType.Integer,
		name: 'allow-embed-reactions',
		description: 'Customize behavior of messages that contain embeds.',
		choices: [
			{
				name: 'Follow rules from /setupserver',
				value: 0,
			},
			{
				name: 'Disallow all',
				value: 1,
			},
			{
				name: 'Allow all',
				value: 2,
			},
			{
				name: 'Allow only for videos that can be played in discord (such as youtube videos)',
				value: 3,
			},
			{
				name: 'Allow only if it has an image or video to show',
				value: 4,
			},
		],
	}, /*
	{
		type: ApplicationCommandOptionType.Boolean,
		name: 'disable-hall-of-fame',
		description: 'Content from this channel won\'t be sent to the hall of fame.',
	},
	{
		type: ApplicationCommandOptionType.Number,
		name: 'hall-of-fame-min-likes',
		description: 'Automatically sends content to hall of fame with this amount of likes. 0 to disable.',
	},*/
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
		const channel = client.channels.cache.get(interaction.channelId);

		const updatedSettings = { ...defaultChannelSettings, ...currentSettings };
		const forbidTextOption = await interaction.options.get('forbid-text')?.value;
		if (forbidTextOption !== undefined) updatedSettings.isTextForbidden = forbidTextOption === undefined ? updatedSettings.isTextForbidden : forbidTextOption;
		const disableHallOfFameOption = await interaction.options.get('disable-hall-of-fame')?.value;
		if (disableHallOfFameOption !== undefined) updatedSettings.dontSendToHallOfFame = disableHallOfFameOption === undefined ? updatedSettings.dontSendToHallOfFame : disableHallOfFameOption;
		const hallOfFameMinLikesOption = await interaction.options.get('hall-of-fame-min-likes')?.value;
		if (hallOfFameMinLikesOption !== undefined) updatedSettings.hallOfFameMinimumLikes = hallOfFameMinLikesOption === undefined ? updatedSettings.hallOfFameMinimumLikes : hallOfFameMinLikesOption;
		const allowEmbedReactions = await interaction.options.get('allow-embed-reactions')?.value;
		if (allowEmbedReactions !== undefined) updatedSettings.allowEmbedReactions = allowEmbedReactions === undefined ? updatedSettings.allowEmbedReactions : allowEmbedReactions;

		await registerChannelSettings({ ...updatedSettings }, { channelId:Number(interaction.channelId), serverId:Number(interaction.guildId), lastKnownName: (channel as TextChannel)?.name ?? '?' }, prismaClient);

		await interaction.followUp({
			ephemeral: true,
			content: getSingleNestedObjectChanges(currentSettings, updatedSettings),
		});
	},
};