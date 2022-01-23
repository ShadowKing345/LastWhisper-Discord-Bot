import dayjs from "dayjs";
import {Client, GuildBan, GuildMember, MessageEmbed, TextChannel, User} from "discord.js";
import {ManagerUtilsConfig} from "../models/mangerUtils";
import {ModuleBase} from "../classes/moduleBase";
import {ManagerUtilsConfigService} from "../services/managerUtilsConfigService";
import {Service} from "typedi";

@Service()
export class ManagerUtilsModule extends ModuleBase {

    constructor(private service: ManagerUtilsConfigService) {
        super();

        this._moduleName = "ManagerUtils";
        this._listeners = [
            {event: "guildBanAdd", run: this.onMemberBanned},
            {
                event: "guildMemberRemove", run: async member => {
                    console.log("Guild member was removed.");
                    if (member.partial) await member.fetch();
                    await this.onMemberLeave(member as GuildMember);
                }
            }
        ];
    }

    private async getConfig(guildId: string): Promise<ManagerUtilsConfig> {
        return this.service.findOneOrCreate(guildId);
    }

    private async getLoggingChannel(client: Client, guildId: string): Promise<TextChannel | null> {
        const config: ManagerUtilsConfig = await this.getConfig(guildId);

        if (!config.loggingChannel) return null;
        const loggingChannel = await client.channels.fetch(config.loggingChannel);
        return loggingChannel && typeof loggingChannel === typeof TextChannel ? loggingChannel as TextChannel : null;
    }

    private async onMemberLeave(member: GuildMember) {
        const loggingChannel: TextChannel | null = await this.getLoggingChannel(member.client, member.guild.id);
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
                .setDescription(`User **${member.displayName}** was kicked by **${(await member.guild.members.fetch((kickedData.executor as User).id)).displayName}** from the server.`);
        } else {
            embed.setTitle("User Left!")
                .setDescription(`User **${member.displayName}** has left this discord server`)
        }

        await loggingChannel.send({embeds: [embed]});
    }

    private async onMemberBanned(ban: GuildBan) {
        const loggingChannel: TextChannel | null = await this.getLoggingChannel(ban.client, ban.guild.id);
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
