export const defaultServerSettings : ServerSettings = {
	likeReaction: '👍',
	dislikeReaction: '👎',
	hallOfFameReaction: '🏆',
};

export const defaultChannelSettings : ChannelSettings = {
	isTextForbidden: false,
	isHallOfFame: false,
	hallOfFameSettings: {
		minimumLikes: 0,
		reactionToUse: '',
		roleRequiredForReaction: '',
	},
	dontSendToHallOfFame: false,
};

export interface ServerSettings {
    likeReaction: string; // The reaction that will be used to like a message.
    dislikeReaction: string; // The reaction that will be used to dislike a message.
    hallOfFameReaction: string; // The reaction that will be used to send a message to the hall of fame channel.
}

export interface ChannelSettings {
    isTextForbidden: boolean; // If true, will delete any messages that don't contain an image/video/embed.
    isHallOfFame: boolean; // If true, will send any messages that get enough likes to the hall of fame channel.
    hallOfFameSettings : HallOfFameSettings; // Settings for the hall of fame channel if isHallOfFame is true.
    dontSendToHallOfFame: boolean; // If true, will not send any messages to the hall of fame channel no matter what.
}

interface HallOfFameSettings {
    minimumLikes: number; // The minimum number of likes a message needs to be sent to the hall of fame channel. Set to 0 to disable.
    reactionToUse: string; // The name of the reaction that will be used to send a message to the hall of fame channel.
    roleRequiredForReaction: string; // The role that is required to use the reaction to send a message to the hall of fame channel.
}