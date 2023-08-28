import { generalizedUpsert } from './generalized-upsert';
import { ChannelSettings, ServerSettings } from '../settings/configure';
import { discordClient } from '../entry';
import { TextChannel } from 'discord.js';


export const registerServerSettings = async (newSettingsObject: ServerSettings, serverId: number, prisma: any) => {
	return await generalizedUpsert({ modelName: 'serverSettings', uniqueId: serverId, kvpArray: [{ k:'lastKnownName', v: discordClient.guilds.cache.get(String(serverId))?.name ?? '?' }, { k:'settings', v: newSettingsObject }], prisma });
};
export const registerChannelSettings = async (newSettingsObject: ChannelSettings, channelId: number, serverId: number, prisma: any) => {
	return await generalizedUpsert({ modelName: 'channelSettings', uniqueId: channelId, kvpArray: [{ k:'lastKnownName', v: (discordClient.channels.cache.get(String(channelId)) as TextChannel)?.name ?? '?' }, { k:'settings', v: newSettingsObject }, { k: 'server', v: { connect: { id: serverId } } }], prisma });
};