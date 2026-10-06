# Mod Helper Bot for Toronto Active Socials

## Problem

I run a local walking group and coordinate everything through Discord. Since I don't personally know everyone who joins the group, I ask new members to introduce themselves in the `introductions` channel.

For each walk, I wanted to limit access to the detailed meetup information to people who had expressed interest in attending. My approach was to create a private thread containing only people who:

- Had marked themselves as interested in the event
- Had introduced themselves in the server

This isn't a foolproof security measure, but it adds another layer of complexity for someone attempting to stalk or harass members.

The problem was that manually creating and maintaining these private threads was tedious and stressful. I had to repeatedly check the event for new people who marked themselves as interested and verify that everyone in the private thread had introduced themselves. This made me anxious, especially as the event got closer.

## Solution

I built a **Mod Helper Bot** to automate the repetitive parts of this process.

The bot is **not intended to run continuously on a server**. I only run the script when an event has at least **6 interested members**. Six people provides a buffer for no-shows and last-minute cancellations.

I also run it a few times before an event. Each time, it shows me the **diff**: which members are newly interested and which members still haven't introduced themselves. For members who haven't introduced themselves, it also provides their Discord user IDs so I can follow up with them.

The script handles three scenarios:

### A. An active event does not have a private thread

1. Create a private thread for the event under the `meetup-logistics` channel.
2. Configure the thread so that only moderators can invite members.
3. Fetch everyone who has marked themselves as interested in the event.
4. Check which interested members have introduced themselves.
5. Add only the members who have both:
   - Marked themselves as interested
   - Introduced themselves in the server

An interested member who has **not** introduced themselves will not be added to the private thread.

### B. An active event already has a private thread

There may be people who marked themselves as interested **after the last time the script was run**.

Instead of automatically adding these members to the thread, the script prints their usernames and names.

I can then paste the output directly into the Discord thread. Discord automatically treats the usernames as mentions and adds the mentioned members to the thread.

This extra work is intentional. It avoids automatically generating a large number of notifications for everyone already in the thread while still making it easy for me to add and remove new members.

### C. There are no active events

If there are no active events in the server, the script simply prints:

> No active events found in this server.
