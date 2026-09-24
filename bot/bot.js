import fs from "fs";
import {config} from "./config.js";
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

// Create a private thread when an event is created
// client.on("guildScheduledEventCreate",   async (event) => {
//     // Create private thread
//     const thread_id = await createChat(
//         channel,
//         event.name
//     );
//     await addMembersToPrivateThread(
//         channel,
//         thread_id,
//         interested_members[event.name]
//     )
// });
//
// // Once the chat is already created and someone selects interested in the event
// client.on("guildScheduledEventUserAdd", async (event, user) => {
//     const threadId = await getThreadID(channel, event.name);
//
//     if (!threadId) {
//         throw new Error(`No thread found for ${event.name}`);
//     }
//
//     await addMembersToPrivateThread(channel, threadId, [user.id]);
// });


async function getServerEvents(server){
    if (!server) console.log("No such server. Please check the specified server ID.") ;
    console.log(`INFO: SERVER: ${server.name}`);

    return await server.scheduledEvents.fetch();
}


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
