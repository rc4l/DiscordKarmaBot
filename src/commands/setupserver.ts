import { CommandInteraction, Client, ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../constants';
import { checkAndSetupWorldAndServer, getSingleNestedObjectChanges, interactionIsInDMs } from '../utils';
import { defaultServerSettings } from '../settings/configure';
import { getServerSettings } from '../queries/get-server-settings';
import { prismaClient } from '../entry';
import { registerServerSettings } from '../queries/register-settings';

export const setupserver: Command = {
	name: 'setupserver',
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: 'like-reaction',
			description: 'Change the like button to be whatever emoji you paste here.',
		},
		{
			type: ApplicationCommandOptionType.String,
			name: 'dislike-reaction',
			description: 'Change the dislike button to be whatever emoji you paste here.',
		},
		{
			type: ApplicationCommandOptionType.Integer,
			name: 'allow-embed-reactions',
			description: 'Customize behavior of messages that contain embeds.',
			choices: [
				{
					name: 'Ignore',
					value: 0,
				},
				{
					name: 'Allow all',
					value: 1,
				},
				{
					name: 'Allow only for videos that can be played in discord (such as youtube videos)',
					value: 2,
				},
				{
					name: 'Allow only if it has an image or video to show',
					value: 3,
				},
			],
		}, /*
		{
			type: ApplicationCommandOptionType.String,
			name: 'hall-of-fame-reaction',
			description: 'Automatically sends content to hall of fame when reacted with this reaction.',
		},
		{
			type: ApplicationCommandOptionType.Role,
			name: 'hall-of-fame-curator',
			description: 'The bot will only respect people with this role on hall of fame reactions. Leave empty to disable.',
		},*/
	],
	description: 'Use this to modify server settings.',
	run: async (client: Client, interaction: CommandInteraction) => {
		let content = '';
		if (interactionIsInDMs(interaction)) {
			content = 'Please run this command within a channel inside a server.';
			await interaction.followUp({
				ephemeral: true,
				content,
			});
		}

		const serverId = Number(interaction.guildId);
		const hasSetup = (await getServerSettings(serverId, prismaClient))?.settings || null;
		await checkAndSetupWorldAndServer(serverId);
		const currentSettings = (await getServerSettings(serverId, prismaClient))?.settings || {};
		const updatedSettings = { ...defaultServerSettings, ...currentSettings };

		const likeReactionOption = await interaction.options.get('like-reaction')?.value;
		const dislikeReactionOption = await interaction.options.get('dislike-reaction')?.value;
		const hallOfFameReactionOption = await interaction.options.get('hall-of-fame-reaction')?.value;
		const hallOfFameCuratorOption = await interaction.options.get('hall-of-fame-curator')?.value;
		const allowEmbedReactions = await interaction.options.get('allow-embed-reactions')?.value;
		if (likeReactionOption !== undefined) updatedSettings.likeReaction = likeReactionOption === undefined ? updatedSettings.likeReaction : likeReactionOption;
		if (dislikeReactionOption !== undefined) updatedSettings.dislikeReaction = dislikeReactionOption === undefined ? updatedSettings.dislikeReaction : dislikeReactionOption;
		if (hallOfFameReactionOption !== undefined) updatedSettings.hallOfFameReaction = hallOfFameReactionOption === undefined ? updatedSettings.hallOfFameReaction : hallOfFameReactionOption;
		if (hallOfFameCuratorOption !== undefined) updatedSettings.hallOfFameCurator = hallOfFameCuratorOption === undefined ? updatedSettings.hallOfFameCurator : hallOfFameCuratorOption;
		if (allowEmbedReactions !== undefined) updatedSettings.allowEmbedReactions = allowEmbedReactions === undefined ? updatedSettings.allowEmbedReactions : allowEmbedReactions;


		await registerServerSettings(updatedSettings, { serverId, lastKnownName:client.guilds.cache.get(interaction.guildId ?? '')?.name ?? '?' }, prismaClient);
		await interaction.followUp({
			ephemeral: true,
			content: !hasSetup ? 'Server registration complete ✅' : getSingleNestedObjectChanges(currentSettings, updatedSettings),
		});
	},
};