const Discord = require("discord.js");
const client = new Discord.Client();
const messageHandler = require("./handlers/message.ts").processMessage;

client.once("ready", () => {
	console.log("Ready!");
});

client.on("message", (message: any) => {
	messageHandler(message);
});

// If you cloned this repo, you will need to make your own secrets.js file with your own token.
client.login(require("./secrets.ts").TOKEN);
