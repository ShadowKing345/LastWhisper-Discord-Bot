import discord
from discord.ext import commands

import utils
from objects import GeneralConfig
from utils.cog_class import CogClass


class General(CogClass, name=utils.CogNames.General.value):
    def __init__(self, client: discord.client):
        super().__init__(client, "./config/general", GeneralConfig)
        self.general_cog: General = self
        self.approved_roles_dict = {
            "get_prefix": None,
            "change_prefix": None,
        }

    @staticmethod
    def get_prefix(client: discord.client, message):
        try:
            return client.get_cog(utils.CogNames.General.value).guildDict[message.guild.id].prefix
        except KeyError:
            return "|"

    @commands.command(name="changePrefix")
    async def change_prefix(self, ctx: commands.Context, prefix: str = "|"):
        guild: GeneralConfig = self.guildDict[ctx.guild.id]
        guild.prefix = prefix
        self.save_configs(ctx.guild.id)
        await ctx.send(f"Prefix changed to {prefix}")

    async def remove_message(self, ctx: commands.Context):
        guild: GeneralConfig = self.guildDict[ctx.guild.id]
        if guild.should_clear_command:
            await ctx.message.delete()
        elif guild.clear_command_exception_list.__contains__(ctx.author.id):
            await ctx.message.delete()

    def get_management_role_ids(self, guild_id: int):
        return self.guildDict[guild_id].management_role_ids


def setup(client: discord.client):
    client.add_cog(General(client))
