# This is a bash script for linux environments to quickly pull docker images and run them. It is meant to be used within 
# as a helper script to quickly wipe and reset the docker image. If you aren't using docker or hosting on a linux environment
# you can ignore this file. And even if you did, it's just a helper file anyway.

# Usage: sh runner.sh <version>
# Example: sh runner.sh v0.0.47
echo "Stop and remove all containers...";
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
echo "...done";

echo "Remove all images...";
docker rmi $(docker images -a -q)
echo "...done";

echo "Setting up the bot with version $1...";
docker run -d -e DATABASE_URL='UPDATETHIS' -e DISCORD_BOT_TOKEN='UPDATETHISTOO' -e DISCORD_APPLICATION_ID='ANDTHIS' --restart=on-failure registry.digitalocean.com/discordkarmabot/discordkarmabot:$1
echo "...done";
