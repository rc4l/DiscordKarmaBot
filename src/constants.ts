import { CommandInteraction, ChatInputApplicationCommandData, Client } from 'discord.js';
export const LIKE = '👍';
export const DISLIKE = '👎';
export const GITHUB_URL = 'https://github.com/rc4l/DiscordKarmaBot';

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
import { goodbye } from './commands/goodbye';
export const Commands: Command[] = [help, goodbye];