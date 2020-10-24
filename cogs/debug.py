import os

import discord
from discord.ext import commands

import utils
import json


class Debug(commands.Cog, name=utils.CogNames.Debug.value):
    def __init__(self, client: discord.client):
        self.client: discord.client = client
        self.cog_functions: dict = {
            "load": lambda cog_name: self.client.load_extension(cog_name),
            "unload": lambda cog_name: self.client.unload_extension(cog_name),
            "reload": lambda cog_name: self.client.reload_extension(cog_name)
        }

    @commands.Cog.listener()
    async def on_message(self, discord_message: discord.Message):
        if discord_message.author == self.client.user and discord_message.channel.id == 692081300860960779:
            return

    @commands.is_owner()
    @commands.command()
    async def get_role(self, ctx: commands.Context):
        role: discord.Role
        for role in ctx.author.roles:
            print(role.id)

    @commands.is_owner()
    @commands.command()
    async def print(self, _, message):
        print(message)

    @commands.is_owner()
    @commands.command(aliases=["FIT"])
    async def fit(self, ctx: commands.Context):
        embed = discord.Embed(
            title="If he say F IT, he be an angry kitten!",
            colour=discord.Colour.red()
        )
        embed.set_image(url="https://pbs.twimg.com/media/EOYaxsOUwAATUf4?format=jpg&name=large")
        await ctx.message.delete()
        await ctx.send(embed=embed)

    @commands.is_owner()
    @commands.command(name="kill")
    async def kill(self, ctx, reason):
        await ctx.send("Kill command activated.")
        await self.client.logout()

    @commands.is_owner()
    @commands.command()
    async def cog(self, ctx: commands.Context, sub_command: str = None, *cog_names):
        extension_list = self.client.extensions.keys()
        cog_list = self.get_cog_list("./cogs")

        if not sub_command:
            cogs = ""
            for cog in cog_list:
                cogs += (":x:" if cog not in extension_list else ":white_check_mark:") + " " + str(cog).split(".").pop() + "\n"
            embed: discord.Embed = discord.Embed(title="Cogs loaded.", description=cogs)
            await ctx.send(embed=embed)
            return
        # cogs_loaded = []
        # if not ctx.invoked_subcommand:
        #     for f in os.listdir("./cogs"):
        #         try:
        #             if f.endswith(".py"):
        #                 self.client.load_extension(f"cogs.{f[:-3]}")
        #                 self.client.unload_extension(f"cogs.{f[:-3]}")
        #         except commands.ExtensionAlreadyLoaded:
        #             cogs_loaded.append(f[:-3])
        #
        #     for f in os.listdir("./cogs/extensions"):
        #         try:
        #             if f.endswith(".py"):
        #                 self.client.load_extension(f"cogs.extensions.{f[:-3]}")
        #                 self.client.unload_extension(f"cogs.extensions.{f[:-3]}")
        #         except commands.ExtensionAlreadyLoaded:
        #             cogs_loaded.append(f[:-3])
        #
        #     await ctx.send(embed=discord.Embed(title="Cogs Loaded.", description=f"```{json.dumps(cogs_loaded, indent=4) }```"))

        if sub_command not in self.cog_functions.keys():
            await ctx.send(f"{sub_command} is not a subcommand.")
            return

        embed: discord.Embed = discord.Embed(title=f"Cogs {sub_command}ed.")
        error_list = []

        if cog_names[0] == "all":
            for cog in cog_list:
                cog_name = cog.split(".").pop()
                try:
                    if sub_command == "load" and cog in extension_list:
                        continue

                    if sub_command == "unload" and cog not in extension_list:
                        continue

                    self.cog_functions[sub_command](cog)
                    embed.add_field(name=cog_name, value=":white_check_mark:", inline=False)
                except Exception as e:
                    embed.add_field(name=cog_name, value=":x:", inline=False)
                    error_list.append(str(e))
        else:
            listed_cog_names = [cog.split(".").pop() for cog in cog_list]
            for cog_name in cog_names:
                try:
                    if cog_name in listed_cog_names:
                        self.cog_functions[sub_command](cog_list[listed_cog_names.index(cog_name)])
                        embed.add_field(name=cog_name, value=":white_check_mark:", inline=False)
                    else:
                        embed.add_field(name=cog_name, value="Does not exist.", inline=False)

                except Exception as e:
                    embed.add_field(name=cog_name, value=":x:", inline=False)
                    error_list.append(str(e))

        if len(error_list) > 0:
            nl = "\n"
            embed.add_field(name="Error List", value=f"```\n{''.join([error + nl + nl for error in error_list])}```",
                            inline=False)

        await ctx.send(embed=embed)

    def get_cog_list(self, path: str):
        result = []
        for f in os.listdir(path):
            if os.path.isdir(f"{path}/{f}"):
                result.extend(self.get_cog_list(f"{path}/{f}"))
            else:
                if f.endswith(".py"):
                    result.append(f"{path[2:]}/{f[:-3]}".replace("/", "."))

        return result


def setup(client: discord.client):
    client.add_cog(Debug(client))
