# Karma Bot by DMF

The goal of this project is to have a scoring system for non-text messages on Discord servers. So images, videos, embeds, etc will always have a customizeable like/dislike button as reaction images where users can click on them to give it a +1 or -1 rating. 

## Tech stack

- Discord.js - Helper library to make working with Discord's API easier
- Typescript - Wanted to learn this; supposedly makes it harder to break stuff compared to vanilla Javascript. Tbh, I just wanna learn it.
- Babel - For the ES6 benefits on code syntax
- Nodemon - Hot reloading
- Postgres + Prisma - Relational database to store settings per server, users, etc. Prisma is used as a wrapper within Node to make life easier.

## Prerequisites

- You'll need a Postgres server of some kind running.
- Make sure you have the correct node/npm version specified within the "engines" object in package.json. If you're on windows you probably [need this](https://github.com/coreybutler/nvm-windows) to manage node versions.
- Create an application + bot from the [Discord Developer Portal](https://discord.com/developers/applications), save the token somewhere, and also enable `Message Content Intent` within the `Bot` menu on their portal. Also make sure the bot is in a discord server and has the following permissions enabled: 
`
Read Messages/View Channels, 
Send Messages, 
Manage Messages, 
Read Message History, 
Add Reactions
`
This should all add up to `76864` within their bot permissions calculator inside the portal. 

## Installation

0. Complete the prerequisites, this bot will literally not work if you don't do all of it.
1. Clone this repo
2. `npm i` to install dependencies
3. `npx prisma init` to setup prisma
4. Throw in your postgres credentials within the generated schema file inside `./prisma/schema.prisma`. [Details here](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql).
5. Once installed you'll need to create a `secrets.js` file inside `./src` with a `TOKEN`. For example: `module.exports = {
	TOKEN: 'Your cool token goes here from the prerequisites',
};`
   This is what will be used to login within `src/index.js`.
6. You are done and can now start the bot by running `npm run start`. Have fun =D

## Directory

- [Discord Developer Portal](https://discord.com/developers/applications)
