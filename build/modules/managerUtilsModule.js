"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerUtilsModule = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const discord_js_1 = require("discord.js");
const moduleBase_1 = require("../classes/moduleBase");
const managerUtilsConfigService_1 = require("../services/managerUtilsConfigService");
const typedi_1 = require("typedi");
let ManagerUtilsModule = class ManagerUtilsModule extends moduleBase_1.ModuleBase {
    constructor(service) {
        super();
        this.service = service;
        this._moduleName = "ManagerUtils";
        this._listeners = [
            {
                event: "guildBanAdd", run: async (_, member) => {
                    await this.onMemberBanned(member);
                }
            },
            {
                event: "guildMemberRemove", run: async (client, member) => {
                    await this.onMemberRemoved(member);
                }
            }
        ];
    }
    async getConfig(guildId) {
        return this.service.findOneOrCreate(guildId);
    }
    async getLoggingChannel(guild) {
        const config = await this.getConfig(guild.id);
        if (config.loggingChannel && guild.channels.cache.has(config.loggingChannel)) {
            return (await guild.channels.fetch(config.loggingChannel));
        }
        return null;
    }
    async onMemberRemoved(member) {
        const loggingChannel = await this.getLoggingChannel(member.guild);
        if (!loggingChannel)
            return;
        const kickedData = (await member.guild.fetchAuditLogs({
            limit: 1,
            type: "MEMBER_KICK"
        })).entries.first();
        const embed = new discord_js_1.MessageEmbed()
            .setColor("RANDOM")
            .addFields({ name: "Joined On:", value: (0, dayjs_1.default)(member.joinedAt).format("HH:mm:ss DD/MM/YYYY") }, { name: "Nickname was:", value: member.nickname ?? "None" }, { name: "Roles:", value: member.roles.cache.map(role => role.toString()).join(" ") })
            .setThumbnail(member.user.displayAvatarURL());
        if (kickedData && kickedData.target.id === member.id) {
            embed.setTitle("User Kicked!")
                .setDescription(`User **${member.displayName}** was kicked by **${(await member.guild.members.fetch(kickedData.executor.id)).displayName}** from the server.`);
        }
        else {
            embed.setTitle("User Left!")
                .setDescription(`User **${member.displayName}** has left this discord server`);
        }
        await loggingChannel.send({ embeds: [embed] });
    }
    async onMemberBanned(ban) {
        const loggingChannel = await this.getLoggingChannel(ban.guild);
        if (!loggingChannel)
            return;
        const banLogs = (await ban.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD" })).entries.first();
        if (banLogs) {
            const executor = banLogs.executor;
            const target = banLogs.target;
            const embed = new discord_js_1.MessageEmbed()
                .setTitle("Member Banned!")
                .setColor("RANDOM");
            if (target) {
                embed
                    .setDescription(`User **${target.tag}** was banned by ${executor ? (await ban.guild.members.fetch(executor.id)).displayName : "Someone who was not part of the server somehow... what how?? "}!`)
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
};
ManagerUtilsModule = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [managerUtilsConfigService_1.ManagerUtilsConfigService])
], ManagerUtilsModule);
exports.ManagerUtilsModule = ManagerUtilsModule;
