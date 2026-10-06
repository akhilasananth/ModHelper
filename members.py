import discord
import os
import json

bot_token = os.getenv("DISCORD_TOKEN")
guild_id = int(os.getenv("ACTIVE_SOCIALS_SERVER_ID"))

intents = discord.Intents.default()
intents.members = True

client = discord.Client(intents=intents)

# When a member introduces themselves, add their info here and run this script
new_members = {
    # member.id: name
    # 'sdf04527': 'TestUser'
    'rash021395' : 'Rashi'
}

def add_new_members(data, new_members, server_members):
    if not new_members: return # No new members to add

    # Introduced members
    current_members = set(member["member_id"] for member in data) if data else set()

    all_members = {member.name: member.id for member in server_members}  # member.id : user_id

    for member_id, name in new_members.items():
        if member_id in current_members:
            continue # skip users that are already recorded

        if member_id not in all_members:
            raise ValueError(f"Member {member_id} not found in Server")

        user_id = str(all_members[member_id])

        data.append({
            'user_id': user_id,
            'member_id': member_id, #TODO:remove this
            'name': name
        })

        print(f"INFO: Added {user_id}\t{member_id}\t{name}")

    return data

@client.event
async def on_ready():
    print(f"Logged in as {client.user}")

    guild = client.get_guild(guild_id)

    if not guild:
        raise ValueError(f'SERVER NOT FOUND: {guild} with ID: {guild_id}')

    print(f"SERVER: {guild.name}")
    db_file = "/Users/akhilaananth/code/DiscordBot/bot/data/members.json"

    with open(db_file, "r") as file:
        content = file.read().strip()
        data = json.loads(content) if content else []
        data = add_new_members(data, new_members, guild.members)

    with open(db_file, "w") as file:
        json.dump(data, file, indent=4)

client.run(bot_token)

# TODO: test add member