import { Guild, GuildBan, GuildMember, MessageEmbed, TextChannel, User } from "discord.js";
import { DateTime } from "luxon";
import { injectable } from "tsyringe";

import { ManagerUtilsConfig } from "../models/mangerUtils.model.js";
import { ManagerUtilsConfigRepository } from "../repositories/managerUtilsConfig.repository.js";

@injectable()
export class ManagerUtilsService {

    constructor(private repo: ManagerUtilsConfigRepository) {
    }

    private async getLoggingChannel(guild: Guild): Promise<TextChannel> {
        const config: ManagerUtilsConfig = await this.findOneOrCreate(guild.id);

        if (config.loggingChannel && guild.channels.cache.has(config.loggingChannel)) {
            return (await guild.channels.fetch(config.loggingChannel)) as TextChannel;
        }

        return null;
    }

    public async onMemberRemoved(member: GuildMember) {
        const loggingChannel: TextChannel | null = await this.getLoggingChannel(member.guild);
        if (!loggingChannel) return;

        const kickedData = (await member.guild.fetchAuditLogs({
            limit: 1,
            type: "MEMBER_KICK",
        })).entries.first();

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .addFields(
                { name: "Joined On:", value: DateTime.fromJSDate(member.joinedAt).toFormat("HH:mm:ss DD/MM/YYYY") },
                { name: "Nickname was:", value: member.nickname ?? "None" },
                { name: "Roles:", value: member.roles.cache.map(role => role.toString()).join(" ") })
            .setThumbnail(member.user.displayAvatarURL());

        if (kickedData && (kickedData.target as User).id === member.id) {
            embed.setTitle("User Kicked!")
                .setDescription(`User **${member.user.username}** was kicked by **${(await member.guild.members.fetch((kickedData.executor as User).id)).displayName}** from the server.`);
        } else {
            embed.setTitle("User Left!")
                .setDescription(`User **${member.user.username}** has left this discord server`);
        }

        await loggingChannel.send({ embeds: [ embed ] });
    }

    public async onMemberBanned(ban: GuildBan) {
        const loggingChannel: TextChannel = await this.getLoggingChannel(ban.guild);
        if (!loggingChannel) return;

        const banLogs = (await ban.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD" })).entries.first();

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

            await loggingChannel.send({ embeds: [ embed ] });
        } else {
            await loggingChannel.send("A ban somehow occurred but no logs about it could be found!");
        }
    }

    private async findOneOrCreate(id: string): Promise<ManagerUtilsConfig> {
        let result = await this.repo.findOne({ guildId: id });
        if (result) return result;

        result = new ManagerUtilsConfig();
        result.guildId = id;

        return await this.repo.save(result);
    }
}
