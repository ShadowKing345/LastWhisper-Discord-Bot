"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleManagerModule = void 0;
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
const builders_1 = require("@discordjs/builders");
const moduleBase_1 = require("../classes/moduleBase");
const roleManagerConfigService_1 = require("../services/roleManagerConfigService");
class RoleManagerModule extends moduleBase_1.ModuleBase {
    constructor() {
        super();
        this.service = new roleManagerConfigService_1.RoleManagerConfigService();
        this._moduleName = "RoleManager";
        this._listeners = [
            {
                event: "guildMemberAdd", run: async (member) => {
                    if (member.partial)
                        await member.fetch();
                    await this.onMemberJoin(member);
                }
            },
            { event: "ready", run: async (client) => await this.onReady(client) }
        ];
        this._commands = [
            {
                command: new builders_1.SlashCommandBuilder()
                    .setName("gen_role_chooser")
                    .setDescription("Displays the buff for the day."),
                run: this.sendButtons
            }
        ];
    }
    async getConfig(guildId) {
        return this.service.findOneOrCreate(guildId);
    }
    async alterMembersRoles(member, newMemberRoleId, memberRoleId) {
        if (!member.roles.cache.has(newMemberRoleId))
            return;
        if (!member.roles.cache.has(memberRoleId)) {
            const memberRole = await member.guild.roles.fetch(memberRoleId);
            if (memberRole) {
                await member.roles.add(memberRole);
            }
        }
        const newMemberRole = await member.guild.roles.fetch(newMemberRoleId);
        if (newMemberRole) {
            await member.roles.remove([newMemberRole]);
        }
    }
    async onReady(client) {
        const configs = await this.service.getAll();
        for (const config of configs) {
            if (!client.guilds.cache.has(config.guildId))
                continue;
            if (!config.reactionListeningChannel || !config.reactionMessageIds.length)
                continue;
            const messages = await (0, utils_1.fetchMessages)(client, config.guildId, config.reactionListeningChannel, config.reactionMessageIds).catch(error => console.error(error));
            if (!messages)
                continue;
            const guild = await client.guilds.fetch(config.guildId);
            if (!guild)
                continue;
            const filter = (reaction, _) => config.reactionMessageIds.includes(reaction.message.id);
            for (const message of messages) {
                for (const reaction of message.reactions.cache.values()) {
                    await reaction.users.fetch();
                    for (const user of reaction.users.cache.values()) {
                        try {
                            const member = await guild.members.fetch(user.id);
                            if (member)
                                await this.alterMembersRoles(member, config.newUserRoleId, config.memberRoleId);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }
                await message.reactions.removeAll();
                message.createReactionCollector({ filter: filter }).on("collect", this.onReactionAdd);
            }
        }
    }
    async onMemberJoin(member) {
        const config = await this.getConfig(member.guild.id);
        if (!config.newUserRoleId)
            return;
        const newMemberRole = await member.guild.roles.fetch(config.newUserRoleId);
        if (newMemberRole)
            await member.roles.add([newMemberRole], "Bot added.");
    }
    async onReactionAdd(messageReaction, user) {
        if (user.bot)
            return;
        const guild = messageReaction.message.guild;
        if (!guild)
            return;
        const member = await guild.members.fetch(user.id);
        if (!member) {
            console.error("How the actual... did a user that is not in the guild react to a message?");
            return;
        }
        const config = await this.getConfig(guild.id);
        await this.alterMembersRoles(member, config.newUserRoleId, config.memberRoleId);
        await messageReaction.remove();
    }
    async sendButtons(interaction) {
        await interaction.reply({
            content: "yolo",
            components: [new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton().setCustomId("fish").setLabel("yolo2").setStyle("PRIMARY"))]
        });
    }
}
exports.RoleManagerModule = RoleManagerModule;
