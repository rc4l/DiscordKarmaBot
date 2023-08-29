import { Client, Events, GatewayIntentBits, MessageReaction, PartialMessageReaction, PartialUser, Partials, User } from 'discord.js';
import { processMessage } from './handlers/message';
import { processLoad } from './handlers/load';
import { processCommand } from './handlers/command';
import { processReaction } from './handlers/reactions';
import { Prisma, PrismaClient } from '@prisma/client';
import { createPrismaRedisCache } from 'prisma-redis-middleware';

// Postgres connection
export const prismaClient = new PrismaClient();

// https://github.com/Asjas/prisma-redis-middleware
const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
	models: [
		// Time is in seconds
		{ model: 'WorldUser', cacheTime: 60 },
		{ model: 'LocalUser', cacheTime: 60 },
		{ model: 'World', cacheTime: 120 },
		{ model: 'Server', cacheTime: 120 },
		{ model: 'ServerSettings', cacheTime: 9999 },
		{ model: 'ChannelSettings', cacheTime: 9999 },
	],
	storage: { type: 'memory', options: { size: 2048, invalidation: true } },
	cacheTime: 300,
	excludeModels: [],
	excludeMethods: [],
	onHit: (key) => {
		console.log('hit', key);
	},
	onMiss: (key) => {
		console.log('miss', key);
	},
	onError: (key) => {
		console.log('error', key);
	},
});


prismaClient.$use(cacheMiddleware);

// See https://discord.com/developers/docs/topics/gateway#list-of-intents
export const discordClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildPresences,
	],
	partials: [
		Partials.Message,
		Partials.Channel,
		Partials.Reaction,
		Partials.User,
		Partials.GuildMember,
	],
});

discordClient.once('ready', async () => {
	processLoad(discordClient, prismaClient).then(async () => {
		await prismaClient.$disconnect();
	}).catch(async (e) => {
		console.error(e);
		await prismaClient.$disconnect();
		process.exit(1);
	});
});

// List of Discord Events -> https://old.discordjs.dev/#/docs/discord.js/14.11.0/typedef/Events
// Messages
discordClient.on(Events.MessageCreate, (message: any) => {
	processMessage(discordClient, message, prismaClient);
});

// Slash commands
discordClient.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isCommand()) return;
	await processCommand(discordClient, interaction);
});

// Reactions
discordClient.on(Events.MessageReactionAdd, async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
	await processReaction(discordClient, reaction, user, prismaClient);
});

// If you cloned this repo, you will need to make your own secrets.js file with your own token.
discordClient.login(process.env.DISCORD_BOT_TOKEN);
