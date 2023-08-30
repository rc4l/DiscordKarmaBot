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

export const NOT_REGISTERED_MESSAGE = 'Server is not registered ❌\nPlease run `/setupserver` to register this server';
export const HELP_MESSAGE = 'Server is registered ✅. Here\'s some example commands to get you started:' +
'\n`/setupserver like-reaction YOURREACTIONHERE` Sets the default 👍 emoji for the whole server. So for example if you use 😂, then use in 😂 place of `YOURREACTIONHERE`.' +
'\n`/setupchannel like-reaction YOURREACTIONHERE` Does the same as above but overrides the default like emoji just for this channel.' +
'\n`/setupserver allow-embed-reactions:Allow all` Allows like/dislike reactions for link embeds instead of just attachments for the whole server.' +
'\n`/setupchannel forbid-text:Messages must contain content` This will automatically delete messages in this channel that don\'t contain media. If you want to enforce a media-only channel this is for you.' +
'\n**These are just examples. There are more options and commands listed here: <https://github.com/rc4l/DiscordKarmaBot#commands-and-options>**' +
'\n*Tip: You can react to a message with recycle ♻️ to force the bot to reprocess the message and add likes/dislikes again.*';