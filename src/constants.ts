import { CommandInteraction, ChatInputApplicationCommandData, Client } from 'discord.js';
export const LIKE = '👍';
export const DISLIKE = '👎';

export interface upsertParams {
    modelName: string;
    uniqueId: number;
    kvpArray: kvp [];
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
import { unsetup } from './commands/unsetup';
import { printsettings } from './commands/printsettings';
export const Commands: Command[] = [help, setupserver, setupchannel, unsetup, printsettings];