import { __decorate, __metadata } from "tslib";
import { AuditLogEvent, EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";
import { ManagerUtilsRepository } from "../repositories/managerUtils.js";
import { Service } from "./service.js";
import { service } from "../decorators/index.js";
let ManagerUtilsService = class ManagerUtilsService extends Service {
    repository;
    constructor(repository) {
        super();
        this.repository = repository;
    }
    async getLoggingChannel(guild) {
        const config = await this.repository.findOneOrCreateByGuildId(guild.id);
        if (config.loggingChannel && guild.channels.cache.has(config.loggingChannel)) {
            return (await guild.channels.fetch(config.loggingChannel));
        }
        return null;
    }
    async onMemberRemoved(member) {
        if (member.partial) {
            await member.fetch();
        }
        const loggingChannel = await this.getLoggingChannel(member.guild);
        if (!loggingChannel)
            return;
        const kickedData = (await member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberKick,
        })).entries.first();
        const embed = new EmbedBuilder()
            .setColor("Random")
            .addFields({
            name: "Joined On:",
            value: DateTime.fromJSDate(member.joinedAt).toFormat("HH:mm:ss DD/MM/YYYY"),
        }, { name: "Nickname was:", value: member.nickname ?? "None" }, {
            name: "Roles:",
            value: member.roles.cache.map(role => role.toString()).join(" "),
        })
            .setThumbnail(member.user.displayAvatarURL());
        if (kickedData && kickedData.target.id === member.id) {
            embed
                .setTitle("User Kicked!")
                .setDescription(`User **${member.user.username}** was kicked by **${(await member.guild.members.fetch(kickedData.executor.id)).displayName}** from the server.`);
        }
        else {
            embed.setTitle("User Left!").setDescription(`User **${member.user.username}** has left this discord server`);
        }
        await loggingChannel.send({ embeds: [embed] });
    }
    async onMemberBanned(ban) {
        const loggingChannel = await this.getLoggingChannel(ban.guild);
        if (!loggingChannel)
            return;
        const banLogs = (await ban.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd,
        })).entries.first();
        if (banLogs) {
            const executor = banLogs.executor;
            const target = banLogs.target;
            const embed = new EmbedBuilder().setTitle("Member Banned!").setColor("Random");
            if (target) {
                embed
                    .setDescription(`User **${target.tag}** was banned by ${executor
                    ? (await ban.guild.members.fetch(executor.id)).displayName
                    : "Someone who was not part of the server somehow... what how?? "}!`)
                    .setThumbnail(target.displayAvatarURL());
            }
            else {
                embed.setDescription("Somehow a user was banned but we cannot find out who it was!");
            }
            await loggingChannel.send({ embeds: [embed] });
        }
        else {
            await loggingChannel.send("A ban somehow occurred but no logs about it could be found!");
        }
    }
    async clearChannelMessages(interaction) {
        const config = await this.repository.findOneOrCreateByGuildId(interaction.guildId);
        if (config.clearChannelBlacklist.includes(interaction.channelId)) {
            return interaction.reply({
                content: "Wo hold it. No! Sorry this channel was blacklisted from the clear command to prevent accidental deletion.",
                ephemeral: true,
            });
        }
        await interaction.deferReply({ ephemeral: true });
        const all = interaction.options.getBoolean("all");
        let amount = all ? 1000 : interaction.options.getNumber("amount") ?? 10;
        let amountDeleted = 0;
        for (amount; amount > 0; amount -= 100) {
            const messages = await interaction.channel.messages.fetch({ limit: Math.min(amount, 100) });
            for (const message of messages.values()) {
                await message.delete();
            }
            amountDeleted += messages.size;
            if (messages.size !== 100) {
                break;
            }
        }
        await interaction.editReply({
            content: `Done. Deleted **${amountDeleted}** messages.`,
        });
    }
};
ManagerUtilsService = __decorate([
    service(),
    __metadata("design:paramtypes", [ManagerUtilsRepository])
], ManagerUtilsService);
export { ManagerUtilsService };
//# sourceMappingURL=managerUtils.js.map