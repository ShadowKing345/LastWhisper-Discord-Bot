from pathlib import Path

from objects import ConfigurationDictionary, Configuration
from discord.ext import commands

import utils
from objects import ManagementToolsConfig
from objects.role_object import RoleObject
from utils.cog_class import CogClass


class ManagementTools(CogClass, name=utils.CogNames.ManagementTools.value):
    def __init__(self, client: commands.bot):
        super().__init__(client, Path("./config/management_tools"), ManagementToolsConfig)

    @commands.command()
    async def clear(self, ctx: commands.Context, number: str = "3"):
        guild: ManagementToolsConfig = self.guildDict[ctx.guild.id]

        if guild.clear_channel_id_blacklist.__contains__(ctx.channel.id):
            await ctx.reply("Sorry this channel has been blacklisted from this command.", delete_after=5)
            return

        if str.isnumeric(number):
            if int(number) == 0:
                await ctx.reply("Really... what were you expecting to be cleared with 0.", delete_after=5)
            else:
                await ctx.channel.purge(limit=int(number))
        elif str(number).lower() == "all":
            await ctx.channel.purge(limit=None)
        else:
            await ctx.reply(f"Cannot remove {number} as it is not a valid command.", delete_after=5,
                            mention_author=False)

        await ctx.send("Finished clearing.", delete_after=5)

    @property
    def get_configs(self) -> ConfigurationDictionary:
        config: ConfigurationDictionary = ConfigurationDictionary()

        config.add_configuration(
            Configuration("clear_allowed_role_ids", "clear_allowed_role_ids", add=self.add, remove=self.remove))
        config.add_configuration(
            Configuration("clear_channel_id_blacklist", "clear_channel_id_blacklist", add=self.add, remove=self.remove))

        return config

    @property
    def role_list(self) -> dict:
        return {
            self.clear.name: RoleObject("", "", True)
        }


def setup(client: commands.bot):
    client.add_cog(ManagementTools(client))
