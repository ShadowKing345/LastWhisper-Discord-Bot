var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dayjs from "dayjs";
import { MessageEmbed } from "discord.js";
import { ManagerUtilsConfigService } from "../services/managerUtilsConfigService.js";
import { ModuleBase } from "../classes/moduleBase.js";
export class ManagerUtilsModule extends ModuleBase {
    constructor() {
        super();
        this.service = new ManagerUtilsConfigService();
        this.moduleName = "ManagerUtils";
        this.listeners = [
            { event: "guildBanAdd", run: (_, member) => __awaiter(this, void 0, void 0, function* () { return yield this.onMemberBanned(member); }) },
            { event: "guildMemberRemove", run: (client, member) => __awaiter(this, void 0, void 0, function* () { return yield this.onMemberRemoved(member); }) }
        ];
    }
    getConfig(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.findOneOrCreate(guildId);
        });
    }
    getLoggingChannel(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.getConfig(guild.id);
            if (config.loggingChannel && guild.channels.cache.has(config.loggingChannel)) {
                return (yield guild.channels.fetch(config.loggingChannel));
            }
            return null;
        });
    }
    onMemberRemoved(member) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const loggingChannel = yield this.getLoggingChannel(member.guild);
            if (!loggingChannel)
                return;
            const kickedData = (yield member.guild.fetchAuditLogs({
                limit: 1,
                type: "MEMBER_KICK"
            })).entries.first();
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .addFields({ name: "Joined On:", value: dayjs(member.joinedAt).format("HH:mm:ss DD/MM/YYYY") }, { name: "Nickname was:", value: (_a = member.nickname) !== null && _a !== void 0 ? _a : "None" }, { name: "Roles:", value: member.roles.cache.map(role => role.toString()).join(" ") })
                .setThumbnail(member.user.displayAvatarURL());
            if (kickedData && kickedData.target.id === member.id) {
                embed.setTitle("User Kicked!")
                    .setDescription(`User **${member.user.username}** was kicked by **${(yield member.guild.members.fetch(kickedData.executor.id)).displayName}** from the server.`);
            }
            else {
                embed.setTitle("User Left!")
                    .setDescription(`User **${member.user.username}** has left this discord server`);
            }
            yield loggingChannel.send({ embeds: [embed] });
        });
    }
    onMemberBanned(ban) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggingChannel = yield this.getLoggingChannel(ban.guild);
            if (!loggingChannel)
                return;
            const banLogs = (yield ban.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD" })).entries.first();
            if (banLogs) {
                const executor = banLogs.executor;
                const target = banLogs.target;
                const embed = new MessageEmbed()
                    .setTitle("Member Banned!")
                    .setColor("RANDOM");
                if (target) {
                    embed
                        .setDescription(`User **${target.tag}** was banned by ${executor ? (yield ban.guild.members.fetch(executor.id)).displayName : "Someone who was not part of the server somehow... what how?? "}!`)
                        .setThumbnail(target.displayAvatarURL());
                }
                else {
                    embed.setDescription("Somehow a user was banned but we cannot find out who it was!");
                }
                yield loggingChannel.send({ embeds: [embed] });
            }
            else {
                yield loggingChannel.send("A ban somehow occurred but no logs about it could be found!");
            }
        });
    }
}
//# sourceMappingURL=managerUtilsModule.js.map