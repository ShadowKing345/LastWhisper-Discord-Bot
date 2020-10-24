import discord
from discord.ext import commands, tasks
from discord.utils import get

import utils
from utils.cog_class import CogClass
from objects import MemberManagerConfig


class MemberManager(CogClass, name=utils.CogNames.MemberManager.value):
    def __init__(self, client: discord.client):
        super().__init__(client, "./config/member_manager", MemberManagerConfig)
        self.welcome_channel_message_ids = {}

    @commands.Cog.listener()
    async def on_raw_reaction_add(self, payload: discord.RawReactionActionEvent):
        guild_id = payload.guild_id
        guild: MemberManagerConfig = self.guildDict[guild_id]

        messages = await self.client.get_channel(guild.welcome_channel_id).history(limit=None).flatten()
        if guild_id not in self.welcome_channel_message_ids.keys():
            self.welcome_channel_message_ids[guild_id] = [message.id for message in messages]

        if not payload.channel_id == guild.welcome_channel_id:
            return

        if payload.message_id not in self.welcome_channel_message_ids[guild_id]:
            return

        member: discord.Member = payload.member
        new_member_role = get(member.guild.roles, id=guild.new_member_role_id)
        member_role = get(member.guild.roles, id=guild.member_role_id)
        if new_member_role in member.roles:
            await member.add_roles(member_role)
            await member.remove_roles(new_member_role)

        await get(messages, id=payload.message_id).clear_reactions()

    @commands.Cog.listener()
    async def on_member_join(self, member: discord.Member):
        guild: MemberManagerConfig = self.guildDict[member.guild.id]

        role: discord.Role = get(member.guild.roles, id=guild.new_member_role_id)
        await member.add_roles(role)

    @commands.command()
    @commands.Cog.listener()
    async def on_member_remove(self, member: discord.Member):
        guild = self.guildDict[member.guild.id]
        embed = discord.Embed(title="User left.", description=f"User **{member.name}** has left this discord server.")
        embed.add_field(name="Joined On:", value=str(member.joined_at)[:-7])
        embed.add_field(name="Nickname was:", value=member.nick)
        embed.set_thumbnail(url=member.avatar_url)
        await get(member.guild.channels, id=guild.on_member_leave_logging_channel).send(embed=embed)


def setup(client: discord.client):
    client.add_cog(MemberManager(client))
