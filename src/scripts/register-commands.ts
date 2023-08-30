// Run this script to register commands to the bot. Don't forget to define your new command within src/constants.ts!
// This only needs to be ran when commands are added or removed. It does not need to be ran when command code is changed.

import { Client, GatewayIntentBits } from 'discord.js';
import { Commands } from '../constants';
import axios from 'axios';
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
	console.log('Login successful!');
	console.log('Registering commands...');
	try {
		await client.application.commands.set(Commands);
		const d = await JSON.stringify(Commands);
		if (process.env.DISABLE_DISCORDBOTS_COMMAND_UPDATE) {
			console.log(`Updating commands on discordbotlist.com to https://discordbotlist.com/api/v1/bots/:${process.env.DISCORD_APPLICATION_ID}/commands`);
			axios.post(
				`https://discordbotlist.com/api/v1/bots/:${process.env.DISCORD_APPLICATION_ID}/commands`,
				d,
				{
					headers: {
						'content-type':'application/json',
						'Accept': 'Token',
						'Access-Control-Allow-Origin': '*',
					},
				},
			).then((response)=>{
				console.log(response.data);
			}).catch((error)=>{
				console.error(error);
			});
		}
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