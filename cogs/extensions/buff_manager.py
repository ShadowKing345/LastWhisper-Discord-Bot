import datetime
import json

import discord
from discord.ext import commands, tasks
from discord.utils import get

import utils
from utils.cog_class import CogClass
from objects import Week, BuffManagerConfig, Buff


class BuffManager(CogClass, name=utils.CogNames.BuffManager.value):
    def __init__(self, client: discord.client):
        super().__init__(client, "./config/week_manager", BuffManagerConfig)
        self.approved_roles_dict = {
            "today_buff": "todays_buff_approved_roles_ids",
            "tomorrow_buff": "tomorrows_buff_approved_roles_ids",
            "week_buffs": "this_week_buffs_approved_roles_ids",
            "next_week_buffs": "next_week_buffs_approved_roles_ids"
        }
        self.today = datetime.datetime.now()

        self.loop.start()

    def cog_unload(self):
        self.loop.cancel()

    @tasks.loop(minutes=1)
    async def loop(self):
        await self.client.wait_until_ready()
        self.today = datetime.datetime.now()

        for key, guild in self.guildDict.items():

            if self.today.hour == guild.morning_message_hour and self.today.minute == 0:
                week, buff = self.get_week_buff(guild, self.today)
                morning_message_channel: discord.TextChannel = self.client.get_channel(guild.morning_message_channel_id)

                # Posts the daily buff message.
                await morning_message_channel.send("Good morning Everyone!",
                                                   embed=utils.get_date_buff_embed(
                                                       "Today's buff shall be:",
                                                       self.today,
                                                       buff
                                                   ))

                # Posts the weeks buffs message.
                if self.today.weekday() == 0:
                    await morning_message_channel.send(
                        embed=utils.get_weeks_buff_embed(
                            week,
                            guild.buff_list
                        ))

    @commands.command(aliases=["today'sBuff", "tdb"])
    async def today_buff(self, ctx: commands.Context):
        guild: WeekManagerConfig = self.guildDict[ctx.guild.id]

        _, buff = self.get_week_buff(guild, self.today)

        await ctx.send(embed=utils.get_date_buff_embed(
            "Today's buff shall be:",
            self.today,
            buff
        ))

    @commands.command(aliases=["tomorrow'sBuff", "trb", "tmb"])
    async def tomorrow_buff(self, ctx: commands.Context):
        guild: WeekManagerConfig = self.guildDict[ctx.guild.id]

        tomorrow = self.today + datetime.timedelta(days=1)
        _, buff = self.get_week_buff(guild, tomorrow)

        await ctx.send(embed=utils.get_date_buff_embed(
            "Tomorrow's buff shall be:",
            tomorrow,
            buff,
        ))

    @commands.command(aliases=["thisWeek'sBuffs", "wbs", "twb"])
    async def week_buffs(self, ctx: commands.Context):
        guild: WeekManagerConfig = self.guildDict[ctx.guild.id]

        week, _ = self.get_week_buff(guild, self.today)

        await ctx.send(embed=utils.get_weeks_buff_embed(
            week,
            guild.buff_list
        ))

    @commands.command(aliases=["nextWeek'sBuffs", "nwb"])
    async def next_week_buffs(self, ctx: commands.Context):
        guild: WeekManagerConfig = self.guildDict[ctx.guild.id]

        week, _ = self.get_week_buff(guild, self.today + datetime.timedelta(days=7))

        await ctx.send(embed=utils.get_weeks_buff_embed(
            week,
            guild.buff_list
        ))

    @staticmethod
    def get_week_buff(config: BuffManagerConfig, date: datetime):
        (row, col) = utils.get_index(date, len(config.weeks))
        week: Week = config.weeks[list(config.weeks.keys())[row]]
        buff: Buff = config.buff_list[list(config.buff_list.keys())[week.get_value(col)]]
        return week, buff

    # region Config
    async def add(self, ctx: commands.Context, variable_to_be_changed: str, value, set_type: utils.TypeCondition = None,
                  condition=None, condition_message: str = "Condition has not been met."):
        if set_type == utils.TypeCondition.NONE:
            actual_variable: dict = self.guildDict[ctx.guild.id][variable_to_be_changed]

            obj: dict = {
                "weeks": lambda x: Week.from_json(x),
                "buff_list": lambda x: Buff.from_json(x)
            }[variable_to_be_changed](json.loads(value))

            index: int = 0
            for key in sorted(obj.keys()):
                if int(key) > index:
                    break
                else:
                    index += 1

            actual_variable[str(index)] = obj
            self.save_configs(ctx.guild.id)
        else:
            await super(BuffManager, self).add(ctx, variable_to_be_changed, value, set_type, condition, condition_message)

    async def remove(self, ctx: commands.Context, variable_to_be_changed: str, value,
                     set_type: utils.TypeCondition = None):
        if set_type == utils.TypeCondition.NONE:
            actual_variable: list = self.guildDict[ctx.guild.id][variable_to_be_changed]

            if type(value) == str and not value.isnumeric():
                raise commands.BadArgument(f"value **{value}** is not a number.")

            if not len(actual_variable) > 0:
                raise commands.BadArgument(f"List **{variable_to_be_changed}** is empty.")

            value = int(value)

            obj = get(actual_variable, identifier=value)
            if obj:
                actual_variable.remove(obj)
            else:
                raise commands.BadArgument(f"there is no {'Week' if variable_to_be_changed.lower() == 'weeks' else 'Buff'} with the index of **{value}**")

            self.save_configs(ctx.guild.id)
        else:
            await super(BuffManager, self).remove(ctx, variable_to_be_changed, value, set_type)

    # endregion


def setup(client: discord.client):
    client.add_cog(BuffManager(client))
