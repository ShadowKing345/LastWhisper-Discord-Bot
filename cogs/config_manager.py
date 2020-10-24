import discord
from discord.ext import commands

import json

from utils import TypeCondition, CogNames
from utils.cog_class import CogClass
from cogs.general import General


class ConfigManager(commands.Cog, name=CogNames.ConfigManager.value):
    def __init__(self, client: discord.client):
        self.client: discord.client = client
        self.general_cog: General = client.get_cog("General_Manager")

    async def cog_before_invoke(self, ctx: commands.Context):
        pass
        # if not await self.general_cog.is_role_approved(ctx, None):
        #     raise commands.CheckFailure("Bad Roles")
        # await self.general_cog.should_remove_message(ctx)

    @commands.group()
    async def config(self, ctx: commands.Context):
        if not await self.client.get_cog(ctx.invoked_subcommand.name).is_enabled(ctx):
            await ctx.send(f"Warning. The extension {ctx.invoked_subcommand.name} is not currently enabled. "
                           f"Configs will still be altered if successful.")

    @config.command(name=CogNames.BuffManager.value)
    async def week_manager(self, ctx: commands.Context, variable_to_be_changed: str, sub_command: str, value: str):
        variable_to_be_changed = variable_to_be_changed.lower()
        cog: CogClass = self.client.get_cog(CogNames.BuffManager.value)

        try:
            if variable_to_be_changed in ("morning_message_channel_id", "morning_message_hour"):

                flag = variable_to_be_changed == "morning_message_hour"

                if sub_command.lower() == "set":
                    await cog.set(ctx, variable_to_be_changed, value, set_type=TypeCondition.NONE if flag else TypeCondition.CHANNEL, condition=(lambda x: 0 <= x <= 23) if flag else None, condition_message=f"Value **{value}** must be between 0 and 23 hours.")
                else:
                    raise commands.BadArgument(f"Sub command **{sub_command}** is not valid.")

            elif variable_to_be_changed in ("todays_buff_approved_roles_ids", "tomorrows_buff_approved_roles_ids", "this_week_buffs_approved_roles_ids", "next_week_buffs_approved_roles_ids", "buff_list", "weeks"):

                if sub_command.lower() == "add":
                    await cog.add(ctx, variable_to_be_changed, value, set_type=TypeCondition.ROLE if not ("weeks", "buff_list").__contains__(variable_to_be_changed) else TypeCondition.NONE)

                elif sub_command.lower() == "remove":
                    await cog.remove(ctx, variable_to_be_changed, value, set_type=TypeCondition.ROLE if not ("weeks", "buff_list").__contains__(variable_to_be_changed) else TypeCondition.NONE)

                else:
                    raise commands.BadArgument(f"Sub command **{sub_command}** is not valid.")

            else:
                raise commands.BadArgument(f"No such variable with name **{variable_to_be_changed}**.")

        except commands.BadArgument as e:
            await ctx.send(str(e))
        finally:
            await ctx.send("Done.")

    @config.command(name=CogNames.MemberManager.value)
    async def member_manager(self, ctx: commands.Context, variable_to_be_changed: str, sub_command: str, value: str):
        variable_to_be_changed = variable_to_be_changed.lower()
        cog: CogClass = self.client.get_cog(CogNames.MemberManager.value)

        try:
            if variable_to_be_changed in ("member_role_id", "new_member_role_id", "welcome_channel_id", "on_member_leave_logging_channel"):

                if sub_command.lower() == "set":
                    await cog.set(ctx, variable_to_be_changed, value, TypeCondition.CHANNEL if variable_to_be_changed in ("welcome_channel_id", "on_member_leave_logging_channel") else TypeCondition.ROLE)
                else:
                    raise commands.BadArgument(f"Sub command **{sub_command}** is not valid.")

            else:
                raise commands.BadArgument(f"No such variable with name **{variable_to_be_changed}**.")

        except commands.BadArgument as e:
            await ctx.send(str(e))
        finally:
            await ctx.send("Done.")

    @config.command(name=CogNames.ManagementTools.value)
    async def management_tools(self, ctx: commands.Context, variable_to_be_changed: str, sub_command: str, value: str):
        variable_to_be_changed = variable_to_be_changed.lower()
        cog: CogClass = self.client.get_cog(CogNames.ManagementTools.value)

        try:
            if variable_to_be_changed in ("clear_allowed_role_ids", "clear_channel_id_blacklist"):

                if sub_command.lower() == "add":
                    await cog.add(ctx, variable_to_be_changed, value, set_type=TypeCondition.ROLE if variable_to_be_changed == "clear_allowed_role_ids" else TypeCondition.CHANNEL)

                elif sub_command.lower() == "remove":
                    await cog.remove(ctx, variable_to_be_changed, value, set_type=TypeCondition.ROLE if variable_to_be_changed == "clear_allowed_role_ids" else TypeCondition.CHANNEL)

                else:
                    raise commands.BadArgument(f"Sub command **{sub_command}** is not valid.")

            else:
                raise commands.BadArgument(f"No such variable with name **{variable_to_be_changed}**.")

        except commands.BadArgument as e:
            await ctx.send(str(e))
        finally:
            await ctx.send("Done.")

    @config.command(name=CogNames.General.value)
    async def general_manager(self, ctx: commands.Context, variable_to_be_changed: str, sub_command: str, value: str):
        variable_to_be_changed = variable_to_be_changed.lower()
        cog: CogClass = self.client.get_cog(CogNames.General.value)

        try:
            if variable_to_be_changed == "should_clear_command":
                if sub_command.lower() == "set":
                    if value.isnumeric() and int(value) > 1:
                        await ctx.send(f"While technically value **{value}** will give a **True** in a bool statement it would be much preferred if you just stayed to 0 and 1.")
                    await cog.set(ctx, variable_to_be_changed, value, TypeCondition.BOOL)
            elif variable_to_be_changed in ("clear_command_exception_list", "management_role_ids"):
                print([m for m in ctx.guild.members])
                if sub_command.lower() == "add":
                    await cog.add(ctx, variable_to_be_changed, value, TypeCondition.USER if variable_to_be_changed == "clear_command_exception_list" else TypeCondition.ROLE)
                elif sub_command.lower() == "remove":
                    await cog.remove(ctx, variable_to_be_changed, value, TypeCondition.USER if variable_to_be_changed == "clear_command_exception_list" else TypeCondition.ROLE)
                else:
                    raise commands.BadArgument(f"Sub command **{sub_command}** is not valid.")
            else:
                raise commands.BadArgument(f"No such variable with name **{variable_to_be_changed}**.")
        except commands.BadArgument as e:
            await ctx.send(str(e))
        finally:
            await ctx.send("Done.")

    @commands.command()
    async def reload(self, ctx: commands.Context, extension: str):
        try:
            if extension in self.extensions_list:
                cog: CogClass = self.client.get_cog(extension)
                cog.load_configs(ctx.guild.id)
            else:
                raise commands.BadArgument(f"No extension with name **{extension}**")

        except commands.BadArgument as e:
            await ctx.send(str(e))
        finally:
            await ctx.send("Done.")

    @commands.group()
    async def extension(self, ctx: commands.Context):
        pass

    @extension.command()
    async def is_enabled(self, ctx: commands.Context, extension: str):
        cog: CogClass = self.client.get_cog(extension)
        try:
            flag = cog.is_enabled(ctx)
            await ctx.send(f"The extension {extension} is **{'Enabled' if flag else 'Disabled'}** on your server.")
        except AttributeError as e:
            await ctx.send(f"Extension **{extension}** does not exist.")

    @extension.command()
    async def enable(self, ctx: commands.Context, extension: str):
        cog: CogClass = self.client.get_cog(extension)
        try:
            await cog.enable(ctx)
        except AttributeError as e:
            await ctx.send(f"Extension **{extension}** does not exist.")

    @extension.command()
    async def disable(self, ctx: commands.Context, extension: str):
        cog: CogClass = self.client.get_cog(extension)
        try:
            await cog.disable(ctx)
        except AttributeError as e:
            await ctx.send(f"Extension **{extension}** does not exist.")


def setup(client: discord.client):
    client.add_cog(ConfigManager(client))
