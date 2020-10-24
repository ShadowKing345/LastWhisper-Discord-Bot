import discord
from discord.ext import commands, tasks
from enum import Enum
from time import strptime, localtime, struct_time, mktime, strftime
from datetime import datetime

import utils
from utils.cog_class import CogClass

from objects import EventConfig, Event


class States(Enum):
    NAME = "NAME"
    DESCRIPTION = "DESCRIPTION"
    TIME = "TIME"
    NONE = None


class EventManager(CogClass, name=utils.CogNames.EventManager.value):

    def __init__(self, client: discord.client):
        super().__init__(client, "./config/event_manager", EventConfig)
        self.loop.start()
        self.approved_roles_dict = {
            "add_trigger": None,
            "get_event_details": None
        }

    def cog_unload(self):
        self.loop.cancel()

    @tasks.loop(minutes=1)
    async def loop(self):
        await self.client.wait_until_ready()
        now: struct_time = struct_time(localtime())

        guild: EventConfig
        for guild_id, guild in self.guildDict.items():
            if not len(guild.events) >= 1:
                continue

            if not len(guild.event_reminder_triggers) >= 1:
                continue

            for event in guild.events:
                if event.datetime.tm_mday == now.tm_mday and event.datetime.tm_mon == now.tm_mon:
                    for reminder in guild.event_reminder_triggers:
                        if (event.datetime.tm_hour - reminder[0], event.datetime.tm_min - reminder[1]) == (now.tm_hour, now.tm_min):
                            await self.client.get_channel(guild.reminder_channel_id).send(f"@ everyone\nThe event {event.name}\nWill being in" + (f" {reminder[0]} hour{'s' if reminder[0] > 1 else ''}" if reminder[0] > 0 else "") + (' and' if reminder[0] > 0 and reminder[1] > 0 else '') + (f" {reminder[1]} minutes{'s' if reminder[1] > 1 else ''}" if reminder[1] > 0 else ""))

            dif = len(guild.events)
            guild.events = [x for x in guild.events if not (datetime.fromtimestamp(mktime(x.datetime)) < datetime.fromtimestamp(mktime(now)))]
            if dif > len(guild.events):
                self.save_configs(guild_id)

    @commands.command()
    async def get_event_details(self, ctx: commands.Context, index: int = None):
        guild: EventConfig = self.guildDict[ctx.guild.id]

        if not index:
            await ctx.send(str(len(guild.events)))

        event: Event = guild.events[index]
        embed = discord.Embed(title=event.name, description=f"{event.description}")

        embed.add_field(name="Date:", value=f"{strftime('%A %b %d' , event.datetime)}", inline=False)
        embed.add_field(name="Time:", value=f"{strftime('%H:%M' , event.datetime)}", inline=False)

        await ctx.send(embed=embed)

    @commands.command()
    async def add_trigger(self, ctx: commands.Context, hour_dif: int, minute_dif: int):
        guild = self.guildDict[ctx.guild.id]
        guild.event_reminder_triggers.append([hour_dif, minute_dif])
        self.save_configs(ctx.guild.id)

    @commands.Cog.listener()
    async def on_message(self, message: discord.Message):
        if message.author == self.client.user:
            return

        if not self.guildDict.__contains__(message.guild.id):
            return
        
        guild: EventConfig = self.guildDict[message.guild.id]
        if not guild.channel_id == message.channel.id:
            return

        event: Event = Event()

        content: [str] = message.content.split("\n")
        content = [x for x in content if x != '']
        state: States = States.NONE
        for line in content:
            if (hold := line.replace(" ", "")).startswith("[") and hold.endswith("]"):
                if (guild.name_tag.replace(" ", ""), guild.description_tag.replace(" ", ""), guild.datetime_tag.replace(" ", "")).__contains__(hold[1:-1]):
                    state = {
                              guild.name_tag.replace(" ", ""): States.NAME,
                              guild.description_tag.replace(" ", ""): States.DESCRIPTION,
                              guild.datetime_tag.replace(" ", ""): States.TIME
                    }[hold[1:-1]]
                else:
                    state = States.NONE
                continue

            if state is States.NAME:
                event.name = line
                state = States.NONE
                continue

            if state is States.DESCRIPTION:
                event.description += (line + "\n")
                continue

            if state is States.TIME:
                event.datetime = strptime(line)
                state = States.NONE
                continue

        if not event.name or not event.description or not event.datetime:
            return

        guild.events.append(event)
        self.save_configs(message.guild.id)


def setup(client: discord.client):
    client.add_cog(EventManager(client))
