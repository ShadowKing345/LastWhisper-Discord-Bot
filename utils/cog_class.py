import json
import os

import discord
from discord.ext import commands

import utils
from objects import CustomConfigObject


class CogClass(commands.Cog):

    def __init__(self, client: discord.client, config_dir: str, config_object: CustomConfigObject.__class__):
        self.client: discord.client = client
        self.guildDict: dict = {}
        self.config_dir: str = config_dir
        self.general_cog = client.get_cog(utils.CogNames.General.value)
        self.approved_roles_dict: dict = {}

        self.config_object: CustomConfigObject.__class__ = config_object

        self.load_configs()

    async def cog_check(self, ctx: commands.Context):
        if not self.is_enabled(ctx):
            return False
        return await self.role_check(ctx)

    async def role_check(self, ctx: commands.Context) -> bool:
        command = str(ctx.invoked_subcommand).split(" ").pop() if ctx.invoked_subcommand else str(ctx.command)

        try:
            config_entry_name: str = self.approved_roles_dict[command]
        except KeyError:
            await ctx.send("Role Entry Not Set.")
            config_entry_name: str = None

        roles = self.guildDict[ctx.guild.id].__dict__[config_entry_name] if config_entry_name else self.general_cog.get_management_role_ids(ctx.guild.id)

        if len(roles) <= 0:
            return True

        for role in ctx.author.roles:
            if roles.__contains__(role.id):
                return True

        await ctx.send("Sorry you do not have the correct permissions to invoke this command.")
        return False

    async def cog_before_invoke(self, ctx):
        await self.general_cog.remove_message(ctx)

    # region Join and Leave Listeners
    @commands.Cog.listener()
    async def on_guild_join(self, guild: discord.Guild):
        if not self.config_object:
            return

        utils.save_as_json(f"{self.config_dir}/{guild.id}.json", self.config_object())
        self.guildDict[guild.id] = self.config_object()

    @commands.Cog.listener()
    async def on_guild_remove(self, guild: discord.Guild):
        if not self.config_object:
            return

        utils.remove_file(f"{self.config_dir}/{guild.id}.json")
        self.guildDict.pop(guild.id)
    # endregion

    # region Config
    def load_configs(self, guild_id: int = None):
        if not guild_id:
            self.guildDict.clear()
            for filename in os.listdir(self.config_dir):
                if filename.endswith(".json"):
                    with open(f"{self.config_dir}/{filename}") as f:
                        json_obj = json.load(f)
                    self.guildDict[int(filename[:-5])] = self.config_object.from_json(json_obj)

        else:
            file_dir = f"{self.config_dir}/{guild_id}.json"
            obj = self.config_object()

            if os.path.isfile(file_dir + ".disabled"):
                os.rename(file_dir + ".disabled", file_dir)

            if not os.path.isfile(file_dir):
                utils.save_as_json(file_dir, obj)

            with open(file_dir) as f:
                obj = self.config_object.from_json(json.load(f))

            self.guildDict[guild_id] = obj

    def save_configs(self, guild_id: int = None):
        if not self.config_object:
            return

        file_dir = f"{self.config_dir}/{guild_id}.json"
        if not guild_id:
            for key in self.guildDict:
                utils.save_as_json(file_dir, self.guildDict[key])

        else:
            if not self.guildDict.__contains__(guild_id):
                utils.save_as_json(file_dir, self.config_object())

            utils.save_as_json(file_dir, self.guildDict[guild_id])

    async def enable(self, ctx: commands.Context):
        if self.is_enabled(ctx):
            await ctx.send("Already Enabled.")
            return

        self.load_configs(guild_id=ctx.guild.id)
        await ctx.send("Done.")

    async def disable(self, ctx: commands.Context):
        if not self.is_enabled(ctx):
            await ctx.send("Already Disabled.")
            return

        self.guildDict.pop(ctx.guild.id)
        os.rename(f"{self.config_dir}/{ctx.guild.id}.json", f"{self.config_dir}/{ctx.guild.id}.json.disabled")

        await ctx.send("Done.")

    def is_enabled(self, ctx: commands.Context) -> bool:
        return self.guildDict.__contains__(ctx.guild.id)

    async def set(self, ctx: commands.Context, variable_to_be_changed: str, value, set_type: utils.TypeCondition = None,
                  condition=None, condition_message: str = "Condition has not been met."):
        guild = self.guildDict[ctx.guild.id]

        if not set_type:
            guild[variable_to_be_changed] = value
        else:
            if type(value) == str and not value.isnumeric():
                raise commands.BadArgument(f"value **{value}** is not a number.")

            value = int(value)
            if not utils.TypeConditionCheck[set_type](ctx, value):
                raise commands.BadArgument(f"value {value} is not a valid **{set_type.name}** that is in your server.")

            if callable(condition):
                if not condition(value):
                    raise commands.BadArgument(condition_message)

            guild[variable_to_be_changed] = bool(value) if set_type == utils.TypeCondition.BOOL else value
        self.save_configs(ctx.guild.id)

    async def add(self, ctx: commands.Context, variable_to_be_changed: str, value, set_type: utils.TypeCondition = None,
                  condition=None, condition_message: str = "Condition has not been met."):
        actual_variable: list = self.guildDict[ctx.guild.id][variable_to_be_changed]
        if not set_type:
            actual_variable.append(value)
        else:
            if type(value) == str and not value.isnumeric():
                raise commands.BadArgument(f"value **{value}** is not a number.")

            value = int(value)

            if not utils.TypeConditionCheck[set_type](ctx, value):
                raise commands.BadArgument(f"value {value} is not a valid **{set_type.name}** that is in your server.")

            self.guildDict[ctx.guild.id][variable_to_be_changed].append(bool(value) if set_type == utils.TypeCondition.BOOL else value)
        self.save_configs(ctx.guild.id)

    async def remove(self, ctx: commands.Context, variable_to_be_changed: str, value,
                     set_type: utils.TypeCondition = None):

        actual_variable: list = self.guildDict[ctx.guild.id][variable_to_be_changed]

        if not len(actual_variable) > 0:
            raise commands.BadArgument(f"List **{variable_to_be_changed}** is empty.")

        if not actual_variable.__contains__(bool(value) if set_type == utils.TypeCondition.BOOL else int(value) if set_type else value):
            raise commands.BadArgument(f"value {value} is not a valid **{set_type.name}** that is in your server.")

        actual_variable.remove(bool(value) if set_type == utils.TypeCondition.BOOL else int(value) if set_type else value)
        self.save_configs(ctx.guild.id)
    # endregion
