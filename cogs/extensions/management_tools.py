import discord
from discord.ext import commands

from objects import ManagementToolsConfig
from utils.cog_class import CogClass

import utils


class ManagementTools(CogClass, name=utils.CogNames.ManagementTools.value):
    def __init__(self, client: discord.client):
        super().__init__(client, "./config/management_tools", ManagementToolsConfig)
        self.approved_roles_dict = {
            "clear": None
        }

    @commands.command()
    async def clear(self, ctx: commands.Context, number: str = "3"):
        guild: ManagementToolsConfig = self.guildDict[ctx.guild.id]

        if guild.clear_channel_id_blacklist.__contains__(ctx.channel.id):
            await ctx.send("Sorry this channel has been blacklisted from this command.", delete_after=5)
            return

        if str.isnumeric(number):
            if int(number) == 0:
                await ctx.send("Really... what were you expecting to be cleared with 0.", delete_after=5)
            else:
                await ctx.channel.purge(limit=int(number))
        elif str(number).lower() == "all":
            await ctx.channel.purge(limit=len(await ctx.channel.history(limit=None).flatten()))
        else:
            await ctx.send(f"Cannot remove {number} as it is not a valid command.", delete_after=5)

        await ctx.send("Finished clearing.", delete_after=5)


def setup(client: discord.client):
    client.add_cog(ManagementTools(client))
