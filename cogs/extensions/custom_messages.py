from datetime import datetime
from pathlib import Path

from objects import ConfigurationDictionary
from discord import TextChannel, Embed
from discord.ext import tasks, commands

import utils
from objects import CustomMessagesConfig, Message, TypeObjects
from utils.cog_class import CogClass


class CustomMessages(CogClass, name=utils.CogNames.CustomMessages.value):
    def __init__(self, client: commands.bot):
        super().__init__(client, Path("./config/custom_message"), CustomMessagesConfig)
        self.loop.start()

    def cog_unload(self):
        self.loop.cancel()

    @commands.group(name="CustomMessage", invoke_without_command=True)
    async def custom_message(self, ctx: commands.Context, message_id: str = None):
        guild: CustomMessagesConfig = self.guildDict[ctx.guild.id]
        if not message_id:
            indexes = []
            for key in guild.messages:
                indexes.append(key)
            await ctx.send(f"List of indexes for registered messages: **{indexes}**.")
            return

        if message_id not in guild.messages.keys():
            raise commands.BadArgument(f"There is no message with index **{message_id}**")

        message: Message = guild.messages[message_id]

        embed: Embed = Embed(title="Custom Message", description=f"Index No. {message_id}")
        embed.add_field(name="Message:", value=f"```{message.message}```", inline=False)
        embed.add_field(name="Date & Time:",
                        value=f"```Date: {message.date.date().__str__()}\nTime: {message.date.time().__str__()[:-3]}```",
                        inline=False)
        embed.add_field(name="Repeat? :", value='Yes :green_circle:' if message.should_repeat else ' No :red_circle:')

        await ctx.send(embed=embed)

    @custom_message.command()
    async def create_message(self, ctx: commands.Context,
                             message: str,
                             channel_id: TextChannel,
                             day: int, month: int, year: int,
                             hour: int, minute: int,
                             should_repeat: bool = False):
        guild: CustomMessagesConfig = self.guildDict[ctx.guild.id]
        if channel_id not in ctx.guild.channels:
            raise commands.BadArgument(f"There is not channel with the ID **{channel_id}** on your server.")

        message = Message(message, TypeObjects.Channel(channel_id.id), datetime(year, month, day, hour, minute),
                          should_repeat)

        index = 0
        for key in sorted(guild.messages.keys()):
            if int(key) > index:
                break
            else:
                index += 1

        guild.messages[str(index)] = message
        self.save_configs(ctx.guild.id)
        await ctx.send("Added.")

    @custom_message.command()
    async def remove_message(self, ctx: commands.Context, message_id: str):
        guild: CustomMessagesConfig = self.guildDict[ctx.guild.id]
        if message_id in guild.messages.keys():
            guild.messages.pop(message_id)
        self.save_configs(ctx.guild.id)
        await ctx.send("Removed.")

    @tasks.loop(minutes=1)
    async def loop(self):
        await self._client.wait_until_ready()
        now: datetime = datetime.now()

        for guild_id, guild in self.guildDict.items():
            for index, message in guild.messages.items():
                if message.date.hour == now.hour and message.date.minute == now.minute:
                    if message.date.year == now.year and message.date.month == now.month and message.date.day == now.day:
                        await self._client.get_channel(message.channel_id).send(message.message)
                        if not message.should_repeat:
                            guild.messages.pop(index)
                            self.save_configs(guild_id)

    @property
    def get_configs(self) -> ConfigurationDictionary:
        return ConfigurationDictionary()

    @property
    def role_list(self) -> dict:
        return {
            self.custom_message.name: None,
            self.create_message.name: None,
            self.remove_message.name: None
        }


def setup(client: commands.bot):
    # client.add_cog(CustomMessages(client))
    ...
