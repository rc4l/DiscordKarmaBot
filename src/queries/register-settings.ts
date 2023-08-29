import { generalizedUpsert } from './generalized-upsert';
import { ChannelSettings, ServerSettings } from '../settings/configure';

export const registerServerSettings = async (newSettingsObject: ServerSettings, params: RegisterServerParams, prisma: any) => {
	const { serverId, lastKnownName } = params;
	return await generalizedUpsert({ modelName: 'serverSettings', uniqueId: serverId, kvpArray: [{ k:'lastKnownName', v: lastKnownName }, { k:'settings', v: newSettingsObject }], prisma });
};
export const registerChannelSettings = async (newSettingsObject: ChannelSettings, params: RegisterChannelParams, prisma: any) => {
	const { channelId, serverId, lastKnownName } = params;
	return await generalizedUpsert({ modelName: 'channelSettings', uniqueId: channelId, kvpArray: [{ k:'lastKnownName', v: lastKnownName }, { k:'settings', v: newSettingsObject }, { k: 'server', v: { connect: { id: serverId } } }], prisma });
};

interface RegisterChannelParams {
    channelId: number;
    serverId: number;
    lastKnownName: string;
}

interface RegisterServerParams {
    serverId: number;
    lastKnownName: string;
}