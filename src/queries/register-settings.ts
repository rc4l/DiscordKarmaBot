import { generalizedUpsert } from './generalized-upsert';
import { ChannelSettings, ServerSettings } from '../settings/configure';


export const registerServerSettings = async (newSettingsObject: ServerSettings, serverId: number, prisma: any) => {
	return await generalizedUpsert({ modelName: 'serverSettings', uniqueId: serverId, kvpArray: [{ k:'settings', v: newSettingsObject }], prisma });
};
export const registerChannelSettings = async (newSettingsObject: ChannelSettings, channelId: number, serverId: number, prisma: any) => {
	return await generalizedUpsert({ modelName: 'channelSettings', uniqueId: channelId, kvpArray: [{ k:'settings', v: newSettingsObject }, { k: 'server', v: { connect: { id: serverId } } }], prisma });
};