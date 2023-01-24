var RoleManagerService_1;
import { __decorate, __metadata } from "tslib";
import { TextChannel } from "discord.js";
import { Timer } from "../utils/objects/timer.js";
import { fetchMessages } from "../utils/index.js";
import { RoleManagerRepository } from "../repositories/roleManager.js";
import { Service } from "./service.js";
import { service } from "../utils/decorators/index.js";
import { Logger } from "../config/logger.js";
let RoleManagerService = RoleManagerService_1 = class RoleManagerService extends Service {
    repository;
    logger = new Logger(RoleManagerService_1);
    collectors = {};
    constructor(repository) {
        super();
        this.repository = repository;
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
                    const member = await message.guild?.members.fetch(user.id);
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
            .on("collect", (messageReaction, user) => {
            void this.onReactionAdd(messageReaction, user).then();
        });
    }
    async onReady(client) {
        await Timer.waitTillReady(client);
        const configs = (await this.repository.getAll()).filter(config => client.guilds.cache.has(config.guildId) &&
            config.reactionListeningChannel &&
            config.acceptedRoleId &&
            config.reactionMessageIds.length > 0);
        for (const config of configs) {
            try {
                const messages = await fetchMessages(client, config.reactionListeningChannel, config.reactionMessageIds);
                if (!messages)
                    continue;
                for (const message of messages) {
                    await RoleManagerService_1.processMessageReactions(message, config);
                    this.registerReactionCollector(message, config);
                }
            }
            catch (error) {
                this.logger.error(error instanceof Error ? error.stack : error);
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
        const config = await this.repository.findOneOrCreateByGuildId(guild.id);
        if (!config.reactionMessageIds.includes(messageReaction.message.id)) {
            return;
        }
        await RoleManagerService_1.alterMembersRoles(member, config.acceptedRoleId);
        await messageReaction.remove();
    }
    async revokeRole(interaction) {
        const config = await this.repository.findOneOrCreateByGuildId(interaction.guildId);
        if (!config?.acceptedRoleId) {
            return interaction.reply({
                content: "Cannot revoke roles as role was not set.",
                ephemeral: true,
            });
        }
        const role = await interaction.guild?.roles.fetch(config.acceptedRoleId);
        if (!role) {
            return interaction.reply({
                content: `Cannot find role with id ${config.acceptedRoleId}.`,
            });
        }
        for (const member of (await interaction.guild?.members.list())?.values() ?? []) {
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role, "Permission revoked by person.");
            }
        }
        return interaction.reply({ content: "Done", ephemeral: true });
    }
    async registerMessage(interaction) {
        const config = await this.repository.findOneOrCreateByGuildId(interaction.guildId);
        const message_id = interaction.options.getString("message_id");
        const channel = (await interaction.guild?.channels.fetch(config.reactionListeningChannel));
        if (!channel) {
            this.logger.debug(`Expected failure: Could not find channel.`);
            return interaction.reply({
                content: "Listening channel was not set. Kindly set the channel before you attempt to register a message.",
                ephemeral: true,
            });
        }
        const message = await channel.messages.fetch(message_id);
        if (!message) {
            this.logger.debug(`Expected failure: Could not find message.`);
            return interaction.reply({
                content: "Failed to find the message with id ${message_id}. Make sure the message is inside the same channel.",
                ephemeral: true,
            });
        }
        config.reactionMessageIds.push(message_id);
        await this.repository.save(config);
        await RoleManagerService_1.processMessageReactions(message, config);
        this.registerReactionCollector(message, config);
        return interaction.reply({
            content: "Successfully registered.",
            ephemeral: true,
        });
    }
    async unregisterMessage(interaction) {
        const config = await this.repository.findOneOrCreateByGuildId(interaction.guildId);
        const message_id = interaction.options.getString("message_id");
        const channel = await interaction.guild?.channels.fetch(config.reactionListeningChannel);
        if (!channel) {
            this.logger.debug(`Expected failure: Could not find channel.`);
            return interaction.reply({
                content: "Listening channel was not set. Kindly set the channel before you attempt to register a message.",
                ephemeral: true,
            });
        }
        if (!(channel instanceof TextChannel)) {
            return interaction.reply({
                content: "Channel is not text based.",
                ephemeral: true,
            });
        }
        const message = await channel.messages.fetch(message_id);
        if (!message) {
            this.logger.debug(`Expected failure: Could not find message.`);
            return interaction.reply({
                content: "Failed to find the message with id ${message_id}. Make sure the message is inside the same channel.",
                ephemeral: true,
            });
        }
        config.reactionMessageIds.splice(config.reactionMessageIds.findIndex(id => id === message_id), 1);
        await this.repository.save(config);
        this.collectors[message_id]?.stop();
        return interaction.reply({
            content: "Successfully unregistered.",
            ephemeral: true,
        });
    }
};
RoleManagerService = RoleManagerService_1 = __decorate([
    service(),
    __metadata("design:paramtypes", [RoleManagerRepository])
], RoleManagerService);
export { RoleManagerService };
//# sourceMappingURL=roleManager.js.map