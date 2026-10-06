import {ChannelType} from "discord.js";
import fs from "fs";
import {config} from "./config.js";

export async function createEventChats(channel, eventsWithoutPrivateChat){
    for (const event of eventsWithoutPrivateChat) {
        // Create chat and send welcome message
        const privateChat = await createPrivateChat(channel, event.name);

        // Add event subscribers to this chat
        const eventSubscriberIds = [...(await event.fetchSubscribers()).keys()]
        const eventWalkerIds = await addEventSubscribersToPrivateChat(privateChat, eventSubscriberIds);
        printEventWalkers(eventWalkerIds)
    }
}

export async function getEventsWithoutPrivateChat(serverEvents, channelThreads) {
    let eventsWithoutPrivateChat = new Set();
    const channelThreadNames = new Set(channelThreads.threads.values().map(thread => thread.name));
    for (const event of serverEvents) {
        if (!channelThreadNames.has(event.name)) {
            eventsWithoutPrivateChat.add(event);
        }
    }
    if (eventsWithoutPrivateChat.size === 0) console.log("INFO: All events have a private chat");

    return eventsWithoutPrivateChat;
}

async function createPrivateChat(channel, event_name) {
    const privateChat = await channel.threads.create({
        name: event_name,
        type: ChannelType.PrivateThread,
        invitable: false,
    });

    console.log(`INFO: Created private thread: ${privateChat?.name}`);

    const message =
        `Welcome ❤️ to the private chat for ${event_name}!\n` +
        `Please do not share meetup details outside this chat. 🙅🏻‍♂️\n` +
        `Ask the organizer first if you need to share it with someone.\n`+
        `:rotating_light: Please let me know **here** if you **cannot** make it. :slight_smile:`

    await privateChat?.send(message);
    return privateChat
}

function getIntroducedMembers() {
    try {
        const members = JSON.parse(fs.readFileSync(config.introducedMembersDbFile, "utf8"));
        return new Map(members.map(member => [member.user_id, [member.member_id, member.name]]));
    } catch (error) {
        console.error("Could not load introduced members:", error);
        throw error;
    }
}

async function addEventSubscribersToPrivateChat(privateChat, eventSubscriberIds) {
    const eventWalkers = new Set()
    for (const id of eventSubscriberIds) {
        eventWalkers.add(await addSubscriberToPrivateChat(privateChat, id))
    }

    return eventWalkers;
}
async function addSubscriberToPrivateChat(privateChat, subscriberId){
    if(!hasMemberIntroducedThemselves(subscriberId)) return;

    await privateChat.members.add(subscriberId);
    console.log(`INFO: ${privateChat.name}: Added new member: ${subscriberId}`);

    return subscriberId;
}

function hasMemberIntroducedThemselves(memberId){
    const introducedMembers = getIntroducedMembers()

    if (!introducedMembers.has(memberId)) {
        console.log(`INFO: This event subscriber ${memberId} has not introduced themselves. They were not added to the chat.`);
        return false;
    }

    return true
}

function printEventWalkers(eventWalkerIds) {
    // For the mod to copy-paste into a message. The bot is not sending this in a message because the mod
    // wants to be able to edt this message as people leave and enter the chat.
    const introducedMembers = getIntroducedMembers()
    const walkerList = [...eventWalkerIds]
        .map(walkerId => {
            if (!hasMemberIntroducedThemselves(walkerId)) return `${walkerId} has not introduced themselves.`
            const [memberId, memberName] = introducedMembers.get(walkerId) ;
            return `@${memberId} - ${memberName}`;
        })
        .join("\n");

    console.log(`**__Meet your fellow walkers! :smiley:__**\n\n:sunflower:**Total :\u00A0${eventWalkerIds.size}**\n\n${walkerList}\n\n`);
}

async function getNewEventSubscribers(privateChat, serverEvent) {
    // const cancelledUsers = new Set()
    const eventSubscriberIds = new Set((await serverEvent?.fetchSubscribers())?.keys());
    const privateChatMemberIDs = new Set((await privateChat?.members.fetch())?.keys());

    return eventSubscriberIds.difference(privateChatMemberIDs);
}

export async function printNewIntroducedEventSubscribers(privateChats, serverEvents) {
    console.log(`INFO: Checking for new event subscribers...`);

    const eventsByName = new Map([...serverEvents.values()].map(event => [event.name, event]));
    const chats = privateChats.threads.values()

    for (const chat of chats) {
        const serverEvent = eventsByName.get(chat.name);
        const newEventSubscriberIds = await getNewEventSubscribers(chat, serverEvent);

        if (newEventSubscriberIds.size > 0) {
            console.log(`INFO: EVENT: ${serverEvent.name}`);
            printEventWalkers(newEventSubscriberIds);
        } else console.log(`INFO: All subscribers to the event are added to the private chat. No Missing subscribers found!`);
    }


}
