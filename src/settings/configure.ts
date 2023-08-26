export const defaultServerSettings : ServerSettings = {
	likeReaction: '👍',
	dislikeReaction: '👎',
	hallOfFameReaction: '🏆',
};

export const defaultChannelSettings : ChannelSettings = {
	isTextForbidden: false,
	hallOfFameMinimumLikes: 0,
	dontSendToHallOfFame: false,
};

export interface ServerSettings {
    likeReaction: string; // The reaction that will be used to like a message.
    dislikeReaction: string; // The reaction that will be used to dislike a message.
    hallOfFameReaction: string; // The reaction that will be used to send a message to the hall of fame channel.
    hallOfFameChannel?: number; // If true, will send any messages that get enough likes to the hall of fame channel.
}

export interface ChannelSettings {
    isTextForbidden: boolean; // If true, will delete any messages that don't contain an image/video/embed.
    dontSendToHallOfFame: boolean; // If true, will not send any messages to the hall of fame channel no matter what.
    hallOfFameMinimumLikes: number; // The minimum number of likes a message needs to automatically be sent to the hall of fame. Set to 0 to disable.
}