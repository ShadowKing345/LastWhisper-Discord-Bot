var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RoleManagerModule_1;
import { MessageActionRow, MessageButton } from "discord.js";
import { injectable } from "tsyringe";
import { ModuleBase } from "../classes/moduleBase.js";
import { RoleManagerConfigService } from "../services/roleManagerConfig.service.js";
import { fetchMessages } from "../utils/utils.js";
let RoleManagerModule = RoleManagerModule_1 = class RoleManagerModule extends ModuleBase {
    service;
    constructor(service) {
        super();
        this.service = service;
        this.moduleName = "RoleManager";
        this.listeners = [
            { event: "guildMemberAdd", run: async (_, member) => this.onMemberJoin(member) },
            { event: "ready", run: async (client) => this.onReady(client) },
        ];
        this.commands = [
            {
                command: builder => builder.setName("gen_role_chooser").setDescription("Displays the buff for the day."),
                run: async (interaction) => RoleManagerModule_1.sendButtons(interaction),
            },
        ];
    }
    static async alterMembersRoles(member, newMemberRoleId, memberRoleId) {
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
    static async sendButtons(interaction) {
        await interaction.reply({
            content: "yolo",
            components: [new MessageActionRow().addComponents(new MessageButton().setCustomId("fish").setLabel("yolo2").setStyle("PRIMARY"))],
        });
    }
    async getConfig(guildId) {
        return this.service.findOneOrCreate(guildId);
    }
    async onReady(client) {
        const configs = await this.service.getAll();
        for (const config of configs) {
            if (!client.guilds.cache.has(config.guildId))
                continue;
            if (!config.reactionListeningChannel || !config.reactionMessageIds.length)
                continue;
            const messages = await fetchMessages(client, config.guildId, config.reactionListeningChannel, config.reactionMessageIds).catch(error => console.error(error));
            if (!messages)
                continue;
            const guild = await client.guilds.fetch(config.guildId);
            if (!guild)
                continue;
            const filter = (reaction) => config.reactionMessageIds.includes(reaction.message.id);
            for (const message of messages) {
                for (const reaction of message.reactions.cache.values()) {
                    await reaction.users.fetch();
                    for (const user of reaction.users.cache.values()) {
                        try {
                            const member = await guild.members.fetch(user.id);
                            if (member)
                                await RoleManagerModule_1.alterMembersRoles(member, config.newUserRoleId, config.memberRoleId);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }
                await message.reactions.removeAll();
                message.createReactionCollector({ filter }).on("collect", (messageReaction, user) => this.onReactionAdd(messageReaction, user));
            }
        }
    }
    async onMemberJoin(member) {
        if (member.partial)
            await member.fetch();
        const config = await this.getConfig(member.guild.id);
        if (!config.newUserRoleId)
            return;
        const newMemberRole = await member.guild.roles.fetch(config.newUserRoleId);
        if (newMemberRole) {
            await member.roles.add([newMemberRole], "Bot added.");
        }
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
        await RoleManagerModule_1.alterMembersRoles(member, config.newUserRoleId, config.memberRoleId);
        await messageReaction.remove();
    }
};
RoleManagerModule = RoleManagerModule_1 = __decorate([
    injectable(),
    __metadata("design:paramtypes", [RoleManagerConfigService])
], RoleManagerModule);
export { RoleManagerModule };
//# sourceMappingURL=roleManager.module.js.map