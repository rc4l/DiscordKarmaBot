// Run this script to register commands to the bot. Don't forget to define your new command within src/constants.ts!
// This only needs to be ran when commands are added or removed. It does not need to be ran when command code is changed.

import { Client, GatewayIntentBits } from 'discord.js';
import { Commands } from '../src/constants';
import dotenv from 'dotenv';
dotenv.config();

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
	if (!client.user || !client.application) {
		return;
	}
	console.log('Registering commands');
	try {
		await client.application.commands.set(Commands);
	}
	catch (e) {
		console.error(e);
		process.exit(1);
	}
	console.log('Registered commands successfully. Exiting...');
	await client.destroy();
	process.exit(0);
});

client.login(process.env.DISCORD_BOT_TOKEN);
