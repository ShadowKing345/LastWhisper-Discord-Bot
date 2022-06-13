var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RoleManagerService_1;
import chalk from "chalk";
import { pino } from "pino";
import { injectWithTransform, singleton } from "tsyringe";
import { LoggerFactory, LoggerFactoryTransformer } from "../shared/logger.js";
import { fetchMessages } from "../shared/utils.js";
import { RoleManagerConfig } from "./roleManager.model.js";
import { RoleManagerRepository } from "./roleManager.repository.js";
let RoleManagerService = RoleManagerService_1 = class RoleManagerService {
    roleManagerConfigRepository;
    logger;
    collectors = {};
    constructor(roleManagerConfigRepository, logger) {
        this.roleManagerConfigRepository = roleManagerConfigRepository;
        this.logger = logger;
    }
    static async alterMembersRoles(member, roleId) {
        if (member.roles.cache.has(roleId)) {
            return;
        }
        const role = await member.guild.roles.fetch(roleId);
        if (role) {
            await member.roles.add(role);
        }
    }
    static async processMessageReactions(message, config) {
        for (const reaction of message.reactions.cache.values()) {
            await reaction.users.fetch();
            for (const user of reaction.users.cache.values()) {
                try {
                    const member = await message.guild.members.fetch(user.id);
                    if (member)
                        await RoleManagerService_1.alterMembersRoles(member, config.acceptedRoleId);
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
        await message.reactions.removeAll();
    }
    registerReactionCollector(message, config) {
        if (this.collectors[message.id] != null) {
            return;
        }
        const filter = (reaction) => config.reactionMessageIds.includes(reaction.message.id);
        this.collectors[message.id] ??= message
            .createReactionCollector({ filter })
            .on("collect", (messageReaction, user) => this.onReactionAdd(messageReaction, user));
    }
    async onReady(client) {
        const configs = await this.roleManagerConfigRepository.getAll();
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
            for (const message of messages) {
                await RoleManagerService_1.processMessageReactions(message, config);
                this.registerReactionCollector(message, config);
            }
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
        const config = await this.findOneOrCreate(guild.id);
        if (!config.reactionMessageIds.includes(messageReaction.message.id)) {
            return;
        }
        await RoleManagerService_1.alterMembersRoles(member, config.acceptedRoleId);
        await messageReaction.remove();
    }
    async revokeRole(interaction) {
        const config = await this.findOneOrCreate(interaction.guildId);
        if (!config?.acceptedRoleId) {
            return interaction.reply({ content: "Cannot revoke roles as role was not set.", ephemeral: true });
        }
        const role = await interaction.guild.roles.fetch(config.acceptedRoleId);
        if (!role) {
            return interaction.reply({ content: `Cannot find role with id ${config.acceptedRoleId}.` });
        }
        for (const member of await interaction.guild.members.cache.values()) {
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role, "Permission revoked by person.");
            }
        }
        return interaction.reply({ content: "Done", ephemeral: true });
    }
    async registerMessage(interaction) {
        const config = await this.findOneOrCreate(interaction.guildId);
        const message_id = interaction.options.getString("message_id");
        const channel = await interaction.guild.channels.fetch(config.reactionListeningChannel);
        if (!channel) {
            this.logger.debug(`${chalk.red("Expected failure:")} Could not find channel.`);
            return interaction.reply({
                content: "Listening channel was not set. Kindly set the channel before you attempt to register a message.",
                ephemeral: true
            });
        }
        const message = await channel.messages.fetch(message_id);
        if (!message) {
            this.logger.debug(`${chalk.red("Expected failure:")} Could not find message.`);
            return interaction.reply({
                content: "Failed to find the message with id ${message_id}. Make sure the message is inside the same channel.",
                ephemeral: true
            });
        }
        config.reactionMessageIds.push(message_id);
        await this.roleManagerConfigRepository.save(config);
        await RoleManagerService_1.processMessageReactions(message, config);
        this.registerReactionCollector(message, config);
        return interaction.reply({ content: "Successfully registered.", ephemeral: true });
    }
    async unregisterMessage(interaction) {
        const config = await this.findOneOrCreate(interaction.guildId);
        const message_id = interaction.options.getString("message_id");
        const channel = await interaction.guild.channels.fetch(config.reactionListeningChannel);
        if (!channel) {
            this.logger.debug(`${chalk.red("Expected failure:")} Could not find channel.`);
            return interaction.reply({
                content: "Listening channel was not set. Kindly set the channel before you attempt to register a message.",
                ephemeral: true
            });
        }
        const message = await channel.messages.fetch(message_id);
        if (!message) {
            this.logger.debug(`${chalk.red("Expected failure:")} Could not find message.`);
            return interaction.reply({
                content: "Failed to find the message with id ${message_id}. Make sure the message is inside the same channel.",
                ephemeral: true
            });
        }
        config.reactionMessageIds.splice(config.reactionMessageIds.findIndex(id => id === message_id), 1);
        await this.roleManagerConfigRepository.save(config);
        this.collectors[message_id]?.stop();
        return interaction.reply({ content: "Successfully unregistered.", ephemeral: true });
    }
    async findOneOrCreate(id) {
        let result = await this.roleManagerConfigRepository.findOne({ guildId: id });
        if (result)
            return result;
        result = new RoleManagerConfig();
        result.guildId = id;
        return await this.roleManagerConfigRepository.save(result);
    }
};
RoleManagerService = RoleManagerService_1 = __decorate([
    singleton(),
    __param(1, injectWithTransform(LoggerFactory, LoggerFactoryTransformer, RoleManagerService_1.name)),
    __metadata("design:paramtypes", [RoleManagerRepository, Object])
], RoleManagerService);
export { RoleManagerService };
//# sourceMappingURL=roleManager.service.js.map