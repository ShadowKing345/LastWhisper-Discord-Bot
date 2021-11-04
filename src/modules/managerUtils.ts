import dayjs from "dayjs";
import {Channel, Client, GuildAuditLogsEntry, GuildBan, GuildMember, MessageEmbed, TextChannel, User} from "discord.js";
import Model, {ManagerUtilConfig} from "../objects/MangerUtils";
import {Module} from "../classes/Module";
import Listener from "../classes/Listener";

async function getConfig(guildId: string): Promise<ManagerUtilConfig> {
    return await Model.findOne({_id: guildId}) ?? await Model.create({_id: guildId});
}

async function getLoggingChannel(client: Client, guildId: string): Promise<TextChannel | null> {
    const config: ManagerUtilConfig = await getConfig(guildId);

    if (!config.loggingChannel) return null;
    const loggingChannel: Channel | null = await client.channels.fetch(config.loggingChannel);
    return loggingChannel && typeof loggingChannel === typeof TextChannel ? loggingChannel as TextChannel : null;
}

async function onMemberLeave(member: GuildMember) {
    const loggingChannel: TextChannel | null = await getLoggingChannel(member.client, member.guild.id);
    if (!loggingChannel) return;

    const kickedData: GuildAuditLogsEntry | undefined = (await member.guild.fetchAuditLogs({
        limit: 1,
        type: "MEMBER_KICK"
    })).entries.first();

    const embed = new MessageEmbed()
        .setColor("RANDOM")
        .addFields(
            {name: "Joined On:", value: dayjs(member.joinedAt).format("HH:mm:ss DD/MM/YYYY")},
            {name: "Nickname was:", value: member.nickname ?? "None"},
            {name: "Roles:", value: member.roles.cache.map(role => role.toString()).join(" ")})
        .setThumbnail(member.user.displayAvatarURL());

    if (kickedData && (kickedData.target as User).id === member.id) {
        embed.setTitle("User Kicked!")
            .setDescription(`User **${member.displayName}** was kicked by **${(await member.guild.members.fetch((kickedData.executor as User).id)).displayName}** from the server.`);
    } else {
        embed.setTitle("User Left!")
            .setDescription(`User **${member.displayName}** has left this discord server`)
    }

    await loggingChannel.send({embeds: [embed]});
}

async function onMemberBanned(ban: GuildBan) {
    const loggingChannel: TextChannel | null = await getLoggingChannel(ban.client, ban.guild.id);
    if (!loggingChannel) return;

    const banLogs = (await ban.guild.fetchAuditLogs({limit: 1, type: "MEMBER_BAN_ADD"})).entries.first();

    if (banLogs) {
        const executor: User | null = banLogs.executor;
        const target: User | null = banLogs.target as User;

        const embed = new MessageEmbed()
            .setTitle("Member Banned!")
            .setColor("RANDOM");

        if (target) {
            embed
                .setDescription(`User **${target.tag}** was banned by ${executor ? (await ban.guild.members.fetch(executor.id)).displayName : "Someone who was not part of the server somehow... what how?? "}!`)
                .setThumbnail(target.displayAvatarURL());
        } else {
            embed.setDescription("Somehow a user was banned but we cannot find out who it was!");
        }

        await loggingChannel.send({embeds: [embed]});
    } else {
        await loggingChannel.send("A ban somehow occurred but no logs about it could be found!");
    }
}

class ManagerUtils extends Module {

    constructor() {
        super("ManagerUtils");

        this.listeners = [
            new Listener(`${this.name}#OnGuildBanAdd`, "guildBanAdd", onMemberBanned),
            new Listener(`${this.name}#OnGuildMemberRemove`, "guildMemberRemove", async member => {
                if (member.partial) await member.fetch();
                await onMemberLeave(member as GuildMember);
            })
        ];
    }
}

export default new ManagerUtils();
