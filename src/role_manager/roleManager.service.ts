import chalk from "chalk";
import { CommandInteraction, Guild, GuildMember, Message, MessageReaction, ReactionCollector, Role, TextChannel, User } from "discord.js";
import { pino } from "pino";
import { singleton } from "tsyringe";

import { createLogger } from "../shared/logger/logger.decorator.js";
import { Client } from "../shared/models/client.js";
import { fetchMessages } from "../shared/utils.js";
import { RoleManagerConfig } from "./roleManager.model.js";
import { RoleManagerRepository } from "./roleManager.repository.js";

@singleton()
export class RoleManagerService {
    private collectors: { [key: string]: ReactionCollector } = {};

    constructor(
        private roleManagerConfigRepository: RoleManagerRepository,
        @createLogger(RoleManagerService.name) private logger: pino.Logger,
    ) {
    }

    private static async alterMembersRoles(member: GuildMember, roleId: string) {
        if (member.roles.cache.has(roleId)) {
            return;
        }

        const role: Role | null = await member.guild.roles.fetch(roleId);
        if (role) {
            await member.roles.add(role);
        }
    }

    private static async processMessageReactions(message: Message, config: RoleManagerConfig): Promise<void> {
        for (const reaction of message.reactions.cache.values()) {
            await reaction.users.fetch();
            for (const user of reaction.users.cache.values()) {
                try {
                    const member: GuildMember | null = await message.guild.members.fetch(user.id);
                    if (member) await RoleManagerService.alterMembersRoles(member, config.acceptedRoleId);
                } catch (error) {
                    console.error(error);
                }
            }
        }

        await message.reactions.removeAll();
    }

    private registerReactionCollector(message: Message, config: RoleManagerConfig) {
        if (this.collectors[message.id] != null) {
            return;
        }

        const filter = (reaction: MessageReaction) => config.reactionMessageIds.includes(reaction.message.id);

        this.collectors[message.id] ??= message
            .createReactionCollector({ filter })
            .on("collect", (messageReaction, user) => this.onReactionAdd(messageReaction, user));
    }

    public async onReady(client: Client) {
        const configs: RoleManagerConfig[] = await this.roleManagerConfigRepository.getAll();

        for (const config of configs) {
            if (!client.guilds.cache.has(config.guildId)) continue;
            if (!config.reactionListeningChannel || !config.reactionMessageIds.length) continue;
            const messages: Message[] | void = await fetchMessages(client, config.guildId, config.reactionListeningChannel, config.reactionMessageIds).catch(error => console.error(error));

            if (!messages) continue;
            const guild: Guild | null = await client.guilds.fetch(config.guildId);
            if (!guild) continue;

            for (const message of messages) {
                await RoleManagerService.processMessageReactions(message, config);
                this.registerReactionCollector(message, config);
            }
        }
    }

    public async onReactionAdd(messageReaction: MessageReaction, user: User) {
        if (user.bot) return;
        const guild: Guild | null = messageReaction.message.guild;
        if (!guild) return;

        const member: GuildMember | null = await guild.members.fetch(user.id);
        if (!member) {
            console.error("How the actual... did a user that is not in the guild react to a message?");
            return;
        }

        const config: RoleManagerConfig = await this.findOneOrCreate(guild.id);

        if (!config.reactionMessageIds.includes(messageReaction.message.id)) {
            return;
        }

        await RoleManagerService.alterMembersRoles(member, config.acceptedRoleId);

        await messageReaction.remove();
    }

    public async revokeRole(interaction: CommandInteraction) {
        const config = await this.findOneOrCreate(interaction.guildId);

        if (!config?.acceptedRoleId) {
            return interaction.reply({ content: "Cannot revoke roles as role was not set.", ephemeral: true });
        }

        const role: Role = await interaction.guild.roles.fetch(config.acceptedRoleId);
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

    public async registerMessage(interaction: CommandInteraction): Promise<void> {
        const config = await this.findOneOrCreate(interaction.guildId);
        const message_id = interaction.options.getString("message_id");

        const channel: TextChannel = await interaction.guild.channels.fetch(config.reactionListeningChannel) as TextChannel;

        if (!channel) {
            this.logger.debug(`${chalk.red("Expected failure:")} Could not find channel.`);
            return interaction.reply({
                content: "Listening channel was not set. Kindly set the channel before you attempt to register a message.",
                ephemeral: true
            });
        }

        const message: Message = await channel.messages.fetch(message_id);

        if (!message) {
            this.logger.debug(`${chalk.red("Expected failure:")} Could not find message.`);
            return interaction.reply({
                content: "Failed to find the message with id ${message_id}. Make sure the message is inside the same channel.",
                ephemeral: true
            });
        }

        config.reactionMessageIds.push(message_id);
        await this.roleManagerConfigRepository.save(config);

        await RoleManagerService.processMessageReactions(message, config);
        this.registerReactionCollector(message, config);

        return interaction.reply({ content: "Successfully registered.", ephemeral: true });
    }

    public async unregisterMessage(interaction: CommandInteraction): Promise<void> {
        const config = await this.findOneOrCreate(interaction.guildId);
        const message_id = interaction.options.getString("message_id");

        const channel: TextChannel = await interaction.guild.channels.fetch(config.reactionListeningChannel) as TextChannel;

        if (!channel) {
            this.logger.debug(`${chalk.red("Expected failure:")} Could not find channel.`);
            return interaction.reply({
                content: "Listening channel was not set. Kindly set the channel before you attempt to register a message.",
                ephemeral: true
            });
        }

        const message: Message = await channel.messages.fetch(message_id);

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

    private async findOneOrCreate(id: string): Promise<RoleManagerConfig> {
        let result = await this.roleManagerConfigRepository.findOne({ guildId: id });
        if (result) return result;

        result = new RoleManagerConfig();
        result.guildId = id;

        return await this.roleManagerConfigRepository.save(result);
    }
}
