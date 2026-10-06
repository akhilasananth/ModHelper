import {Client, GatewayIntentBits, ChannelType} from 'discord.js';
import {handleReady} from "./event_handlers.js";

const client = new Client(
    {
        intents: [
            GatewayIntentBits.Guilds, // Receive Server/guild information and events
            GatewayIntentBits.GuildMessages, // Receive Messages sent in server channels
            GatewayIntentBits.GuildMembers, // Receive Member join/update/leave events and member-related data
            GatewayIntentBits.MessageContent, // Receive The actual text inside messages
            GatewayIntentBits.GuildScheduledEvents, // Receive Scheduled event creation/update/delete/subscriber events
        ],
    });


client.once("ready", async () => {
    console.log(`INFO: Logged in as ${client.user.tag}`);
    await handleReady(client)

});

// +++++++===+++++++++++++++++++++++++++++++++++++++++++++++==========================


if (process.env.NODE_ENV !== "test") {
    client.login(process.env.DISCORD_TOKEN);
}

//TODO
// Check possible nulls
// check if events are active
// how do you write tests for this?
// naming conventions js
// How to have an organized, trustworthy and beautiful js code? this is spaghetti to me even if it works
// Interfaces?
// print a list of member ids and names for me to copy paste into my spreadsheet
// If the message can be updated based on the people in the chat.. **__Meet your fellow walkers! :smiley:__**
// :sunflower:**Total:  6 **
// :rotating_light: Please let me know **here** if you **cannot** make it. :slight_smile:
// Have this running on a server
// Have a cache tracking event and the chat.. who left/were removed from the chat and when,
//  who said they weren't interested and when? clear cache and store data in another db for analysis when the event ends
