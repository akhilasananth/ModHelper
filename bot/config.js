import dotenv from "dotenv";
dotenv.config();

export const config = {
    serverId : process.env.ACTIVE_SOCIALS_SERVER_ID,
    channelId : process.env.ACTIVE_SOCIALS_MEETUP_LOGISTICS, // Channel off of which the private threads are created
    introducedMembersDbFile: "/Users/akhilaananth/code/DiscordBot/bot/data/members.json"
}