import { Client, Events, GatewayIntentBits } from 'discord.js';
import { processMessage } from './handlers/message';
import { processLoad } from './handlers/load';
import { processCommand } from './handlers/command';
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
	storage: { type: 'memory', options: { size: 2048 } },
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
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
	],
});

client.once('ready', async () => {
	processLoad(client, prismaClient).then(async () => {
		await prismaClient.$disconnect();
	}).catch(async (e) => {
		console.error(e);
		await prismaClient.$disconnect();
		process.exit(1);
	});
});

// List of Discord Events -> https://old.discordjs.dev/#/docs/discord.js/14.11.0/typedef/Events
// Messages
client.on(Events.MessageCreate, (message: any) => {
	processMessage(client, message, prismaClient);
});

// Slash commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isCommand()) return;
	await processCommand(client, interaction);
});

// If you cloned this repo, you will need to make your own secrets.js file with your own token.
client.login(process.env.DISCORD_BOT_TOKEN);
