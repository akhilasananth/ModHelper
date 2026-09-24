import {config} from "./config.js";
import {
    createEventChats,
    getEventsWithoutPrivateChat,
    printNewEventSubscribersToPrivateThreads
} from "./functions.js";


export async function handleReady(client) {
    const server = await client.guilds.fetch(config.serverId);
    const serverEvents = await server.scheduledEvents.fetch();

    const channel = server?.channels.cache.get(config.channelId);

    if (!channel) {
        console.log("No channel was given");
        return;
    }

    console.log(`INFO: CHANNEL: ${channel.name}`);

    const channelThreads = await channel.threads.fetch();

    const eventsWithoutPrivateChat = new Set(await getEventsWithoutPrivateChat(serverEvents.values(),channelThreads));

    if (eventsWithoutPrivateChat.size > 0){
        await createEventChats(channel, eventsWithoutPrivateChat)
        return;
    }

    // The bot might not always be running, compare the number of people in the chat and the event and add members who are not in the chat
    await printNewEventSubscribersToPrivateThreads(channelThreads, serverEvents)
}

async function handleScheduledEventCreate(event) {
    // Create the thread
    // Send the intro message
}

async function handleScheduledEventUpdate(oldEvent, newEvent) {
    // Update the thread/subscribers if necessary
}

