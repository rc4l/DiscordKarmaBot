# Karma Bot by DMF

This is a way to automatically curate discord servers. Specifically for meme channels.

## Tech stack

- Discord.js - Helper library to make working with Discord's API easier

## Installation

1. Create an application + bot from the [Discord Developer Portal](https://discord.com/developers/applications)
2. Clone this repo
3. Update the token for the bot to whatever is given from the Discord Developer Portal
4. `npm i` to install dependencies
5. `npm run start` to run the bot
6. Make sure you have the correct node/npm version specified within the "engines" object in package.json. If you're on windows you probably [need this](https://github.com/coreybutler/nvm-windows) to manage node versions.
7. Once installed you'll need to create a secrets.js file within src. For example: `module.exports = {
	TOKEN: 'Your cool token goes here from step #3',
};`
   This is what will be used to login within `src/index.js`.
8. You are done. Enjoy ^^

## Directory

- [Discord Developer Portal](https://discord.com/developers/applications)
