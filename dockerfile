FROM node:18.17.1-alpine
ENV DATABASE_URL=$DATABASE_URL \
    DISCORD_BOT_TOKEN=$DISCORD_BOT_TOKEN \
    DISCORD_APPLICATION_ID=$DISCORD_APPLICATION_ID
RUN npm -g install npm@9.8.1
RUN mkdir /app
WORKDIR /app
RUN ls
COPY package.json /app
COPY . /app
CMD ["npm", "run", "startdocker"]