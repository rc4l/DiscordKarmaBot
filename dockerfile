FROM node:18.17.1
RUN npm -g install npm@9.8.1
RUN mkdir /app
WORKDIR /app
RUN ls
COPY package.json /app
COPY . /app
CMD ["npm", "run", "startdocker"]