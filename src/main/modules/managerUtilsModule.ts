import dayjs from "dayjs";
import {Guild, GuildBan, GuildMember, MessageEmbed, TextChannel, User} from "discord.js";
import {ManagerUtilsConfig} from "../models/mangerUtils.js";
import {ManagerUtilsConfigService} from "../services/managerUtilsConfigService.js";
import {ModuleBase} from "../classes/moduleBase.js";

export class ManagerUtilsModule extends ModuleBase {
    private service: ManagerUtilsConfigService;

    constructor() {
        super();
        this.service = new ManagerUtilsConfigService();

        this._moduleName = "ManagerUtils";
        this._listeners = [
            {event: "guildBanAdd", run: async (_, member) => await this.onMemberBanned(member)},
            {event: "guildMemberRemove", run: async (client, member) => await this.onMemberRemoved(member)}
        ];
    }

    private async getConfig(guildId: string): Promise<ManagerUtilsConfig> {
        return this.service.findOneOrCreate(guildId);
    }

    private async getLoggingChannel(guild: Guild): Promise<TextChannel> {
        const config: ManagerUtilsConfig = await this.getConfig(guild.id);

        if (config.loggingChannel && guild.channels.cache.has(config.loggingChannel)) {
            return (await guild.channels.fetch(config.loggingChannel)) as TextChannel;
        }

        return null;
    }

    private async onMemberRemoved(member: GuildMember) {
        const loggingChannel: TextChannel | null = await this.getLoggingChannel(member.guild);
        if (!loggingChannel) return;

        const kickedData = (await member.guild.fetchAuditLogs({
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
                .setDescription(`User **${member.user.username}** was kicked by **${(await member.guild.members.fetch((kickedData.executor as User).id)).displayName}** from the server.`);
        } else {
            embed.setTitle("User Left!")
                .setDescription(`User **${member.user.username}** has left this discord server`);
        }

        await loggingChannel.send({embeds: [embed]});
    }

    private async onMemberBanned(ban: GuildBan) {
        const loggingChannel: TextChannel = await this.getLoggingChannel(ban.guild);
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
}
