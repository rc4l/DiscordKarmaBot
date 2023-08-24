# Karma Bot by DMF

The goal of this project is to have a scoring system for non-text messages on Discord servers. So images, videos, embeds, etc will always have a customizeable like/dislike button as reaction images where users can click on them to give it a +1 or -1 rating. 

## Tech stack

- Discord.js - Helper library to make working with Discord's API easier.
- Typescript - Wanted to learn this; supposedly makes it harder to break stuff compared to vanilla Javascript. Tbh, I just wanna learn it.
- Babel - For the ES6 benefits on code syntax.
- Nodemon - Hot reloading.
- Postgres + Prisma - Relational database to store settings per server, users, etc. Prisma is an ORM (Object relational mapping) library to elegantly generate Postgres queries.
- Redis - Caching through the ioRedis library.

## Prerequisites

- You'll need a Postgres server of some kind running.
- Make sure you have the correct node/npm version specified within the "engines" object in package.json. If you're on windows you probably [need this](https://github.com/coreybutler/nvm-windows) to manage node versions.
- Create an application + bot from the [Discord Developer Portal](https://discord.com/developers/applications), save the application id and token somewhere, and also enable `Message Content Intent` within the `Bot` menu on their portal. Also make sure the bot is in a discord server and has the following permissions enabled: 
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
1. Clone this repo.
2. `npm i` to install dependencies.
3. `npx prisma init` to setup prisma.
4. Throw in your postgres credentials within the newly generated `./.env` file. [Supplementary information here if confused](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql). Also run `npx prisma migrate dev --name init`; any changes made to the schema requires this to be ran every time.
5. Inside the `.env` file, within a new line, add the token with the name DISCORD_BOT_TOKEN. For example: `DISCORD_BOT_TOKEN="YOUR TOKEN GOES HERE"`.
5. Inside the `.env` file, within a new line, add the application id with the name DISCORD_APPLICATION_ID. For example: `DISCORD_APPLICATION_ID="YOUR APP ID GOES HERE"`.
6. You are done and can now start the bot by running `npm run start`. Make sure it runs and is able to connect to a discord server.
7. You'll notice slash commands don't work such as `/help`. To do that you'll need to run a custom script I made. It is already defined in package.json so to run it simply do `npm run updatecommands`.
8. Run `npm run start` again. `/help` should now work as a valid command among others. You are now ready to develop :D

## Adding or removing /commands (slash commands)
These steps need to be followed whenever a new command is added, removed, or if you modified anything aside from the `run` function within your command. The reason it's designed this way is because [there's a daily limit on command registration requests](https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration) so simply running it every time on startup when we don't need to would eventually halt development for a day. Therefore this is a separate process entirely.

1. Define it within the commands folder within its own file. You can use the other files in that folder as examples.
2. Import the file you just made and define it within the constants file. Make sure it gets appended to the array and the name is correct.
3. Run `npm run updatecommands`.
4. Next time you run your bot the command should be available.

## Directory

- [Discord Developer Portal](https://discord.com/developers/applications)
