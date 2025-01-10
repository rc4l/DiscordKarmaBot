# Karma Bot by DMF
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/rc4l/discordkarmabot/main?logo=github&label=latest%20update&color=blue) ![GitHub tag (with filter)](https://img.shields.io/github/v/tag/rc4l/DiscordKarmaBot?label=release&color=orange) [![Deployments](https://github.com/rc4l/DiscordKarmaBot/actions/workflows/publish-auto-versioning.yaml/badge.svg?branch=)](https://github.com/rc4l/DiscordKarmaBot/actions/workflows/publish-auto-versioning.yaml)

![Logo](https://i.imgur.com/zhJpAC5.png)

![Examples](https://i.imgur.com/adNBjV0.png)

This bot originally started as a tool for my own discord for the various art, video, meme, etc, channels where they're attachment heavy. The main point is to automatically add like/dislikes to all types of media posted on a discord server so nobody has to manually do it.

[Click here to add the bot to your discord server](https://discord.com/api/oauth2/authorize?client_id=750646677219573770&permissions=292058115136&scope=bot)
[Terms of Service](https://gist.github.com/rc4l/c75fb08ba389f002c6ef2b4ea5516853)
[Privacy Policy](https://gist.github.com/rc4l/029b589c712419c2e2505a3f7cc17a63)

[Click here to join the support server](https://discord.gg/jyCCFGJa6F)

## How to start the bot

Simply run `/setupserver` to register the bot with your server and run with some default settings. `/help` will show some example commands I run on my server to get you started.

## Commands and options

Note: You'll need to be an admin of the server (basically have manage server permissions) to run any of these commands.

### Global commands
`/setupserver` This registers your server with the bot so that it can actually work. It comes with the following options:
- `like-reaction`: You can override the default "like" emoji with another one here. Custom reactions must be from the same server.
- `dislike-reaction`: You can override the default "dislike" emoji with another one here. Custom reactions must be from the same server.
- `allow-embed-reactions`: This has several options, any of the `allow` options will make the bot automatically add like/dislike reactions to messages that contain links which have embeds.
    - `Ignore`: The bot won't add likes/dislikes to embeds
    - `Allow all`: The bot will add likes/dislikes to everything that has an embed
    - `Allow only for videos that can be played in discord (such as youtube videos)`: The bot will only add likes/dislikes to linked videos that can be played through discord (eg youtube, direct video links, etc).
    - `Allow only if it has an image or video to show`: If the embedded link has any sort of image or preview, then the bot will automatically add likes/dislikes

### Channel commands
`/setupchannel` You don't have to run this at all unless you want some channel-specific goodies. Such as:
- `forbid-text`: This makes it so any message inside the channel that don't contain media will be automatically deleted.
    - `Allow anything to be posted`: Text-only messages are allowed.
    - `Messages must contain content`: All messages must contain reactable media or it gets deleted automatically.
- `allow-embed-reactions`: This is the exact same thing from Global commands, `/setupserver allow-embed-reactions`, that you can override in a specific channel. For example, if you globally have embed reactions off but want them on specifically in a channel then this is for you.
    - `Follow rules from /setupserver`: Will follow rules defined in `/setupserver` instead
    - `Ignore`: The bot won't add likes/dislikes to embeds
    - `Allow all`: The bot will add likes/dislikes to everything that has an embed
    - `Allow only for videos that can be played in discord (such as youtube videos)`: The bot will only add likes/dislikes to linked videos that can be played through discord (eg youtube). Any video link that requires you to open an app or browser to play won't have likes/dislikes added
    - `Allow only if it has an image or video to show`: If the embedded link has any sort of image or preview, then the bot will automatically add likes/dislikes

### Special reactions
♻️
If there are any messages that don't have the like/dislike emojis, you can react to a message yourself with the ♻️ (recycle) emoji and the bot will attempt to add the like/dislike emoji back in and remove the ♻️.

# For developers

If you're a developer that's curious on how everything is setup then this section is for you.

## Tech stack

- Discord.js - Helper library to make working with Discord's API easier.
- Typescript - Wanted to learn this; supposedly makes it harder to break stuff compared to vanilla Javascript. Tbh, I just wanna learn it.
- Babel - For the ES6 benefits on code syntax.
- Nodemon - Hot reloading.
- Postgres + Prisma - Relational database to store settings per server, users, etc. Prisma is an ORM (Object relational mapping) library to elegantly generate Postgres queries.
- Redis - Caching through the ioRedis library.
- Docker - Containerization so it's easy to deploy.

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

## Local Installation

0. Complete the prerequisites, this bot will literally not work if you don't do all of it.
1. Clone this repo.
2. `npm i` to install dependencies.
3. (Optional) `npx prisma init` to setup prisma if you aren't using my schema.
4. Throw in your postgres credentials within the newly generated `./.env` file. [Supplementary information here if confused](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql). Also run `npx prisma migrate dev --name init`; any changes made to the schema requires this to be ran every time.
5. Inside the `.env` file, within a new line, add the token with the name DISCORD_BOT_TOKEN. For example: `DISCORD_BOT_TOKEN="YOUR TOKEN GOES HERE"`.
5. Inside the `.env` file, within a new line, add the application id with the name DISCORD_APPLICATION_ID. For example: `DISCORD_APPLICATION_ID="YOUR APP ID GOES HERE"`.
6. You are done and can now start the bot by running `npm run start`. Make sure it runs and is able to connect to a discord server.
7. You'll notice slash commands don't work such as `/help`. To do that you'll need to run a custom script I made. It is already defined in package.json so to run it simply do `npm run updatecommands`.
8. Run `npm run start` again. `/help` should now work as a valid command among others. 
9. (Once per server) Don't forget to invite the bot into your server. From the [Discord Developer Portal](https://discord.com/developers/applications) create an invite link, head back to the My Apps page under the "Applications" section, click on your bot application, and open the OAuth2 page and generate the url. Make sure the correct permissions are applied in the url link you're generating from the prerequisites section.
10. You are now ready to develop =D

## Adding or removing /commands (slash commands)
These steps need to be followed whenever a new command is added, removed, or if you modified anything aside from the `run` function within your command. The reason it's designed this way is because [there's a daily limit on command registration requests](https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration) so simply running it every time on startup when we don't need to would eventually halt development for a day. Therefore this is a separate process entirely.

0. (Required if you're making a new command) Define your command within the `./src/commands` folder by creating a new file. You can use the other files in that folder as examples. Once done, you'll need to add the newly made command within the `Commands` array inside `./src/constants` by importing it. You can use the other commands within the constants file as examples and make sure to save when you think you are done.
1. Run `npm run updatecommands`.
2. The list of commands should now be updated and you can run your bot again via `npm run start` to validate. The changes you made should be testable now.

## Docker
If you want to build a docker image just run `docker build -t discordkarmabotbydmf .`. Don't forget to add the environment variables described in the local installation section too.

## Hosting
If you want something more than just running and hosting this locally then I recommend using the `dockerfile` within the root directory and creating an image; I personally host it this way on DigitalOcean for example. There's a github workflow that generates a docker image that gets uploaded to their container repository which my droplet uses. Any time it gets updated then my droplet uses the new upload. The file that handles all of this is located within `.github/workflows/publish-auto.yaml`. Remember to be very careful about exposing tokens, secrets, etc when pursuing this route.

## Directory

- [Discord Developer Portal](https://discord.com/developers/applications)
