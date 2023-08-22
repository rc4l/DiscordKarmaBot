import { Client, Events, GatewayIntentBits } from 'discord.js';
import { processMessage } from './handlers/message';
import { processLoad } from './handlers/load';
import { TOKEN } from './secrets';

// See https://discord.com/developers/docs/topics/gateway#list-of-intents
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
	],
});

client.once('ready', () => {
	processLoad();
});

// List of Discord Events -> https://old.discordjs.dev/#/docs/discord.js/14.11.0/typedef/Events
// Messages
client.on(Events.MessageCreate, (message: any) => {
	processMessage(client, message);
});

// If you cloned this repo, you will need to make your own secrets.js file with your own token.
client.login(TOKEN);
