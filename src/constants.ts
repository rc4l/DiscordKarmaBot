import { CommandInteraction, ChatInputApplicationCommandData, Client } from 'discord.js';
export const LIKE = '👍';
export const DISLIKE = '👎';
export const UNKNOWN = '❓';
export const REFRESH = '♻️';

export interface upsertParams {
    modelName: string;
    uniqueId: number;
    kvpArray: kvp [];
    prisma: any;
}

export interface upsertParamsSpecial {
    modelName: string;
    uniqueId: number;
    kvpArrayCreate: kvp [];
    kvpArrayUpdate: kvp [];
    prisma: any;
}

export interface findByIdParams {
    modelName: string;
    kvpArray: kvp [];
    prisma: any;
}

export interface kvp {
    k: string;
    v: any;
}


export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: CommandInteraction) => void;
}

import { help } from './commands/help';
import { setupserver } from './commands/setupserver';
import { setupchannel } from './commands/setupchannel';
export const Commands: Command[] = [help, setupserver, setupchannel];