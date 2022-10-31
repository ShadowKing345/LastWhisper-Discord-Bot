import { CommandInteraction, Guild, GuildMember, Message, MessageReaction, ReactionCollector, Role, TextChannel, User, InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { singleton } from "tsyringe";

import { createLogger } from "../utils/loggerService.js";
import { Client } from "../utils/models/client.js";
import { Timer } from "../utils/objects/timer.js";
import { fetchMessages } from "../utils/index.js";
import { RoleManagerConfig } from "../models/role_manager/roleManager.model.js";
import { RoleManagerRepository } from "../repositories/roleManager.repository.js";

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
                    const member: GuildMember = (await message.guild?.members.fetch(user.id))!;
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
        await Timer.waitTillReady(client);
        const configs: RoleManagerConfig[] = (await this.roleManagerConfigRepository.getAll())
            .filter(config => client.guilds.cache.has(config.guildId)
                && config.reactionListeningChannel
                && config.acceptedRoleId
                && config.reactionMessageIds.length > 0);

        for (const config of configs) {
            try {
                const messages: Message[] | void = await fetchMessages(client, config.reactionListeningChannel, config.reactionMessageIds)
                if (!messages) continue;

                for (const message of messages) {
                    await RoleManagerService.processMessageReactions(message, config);
                    this.registerReactionCollector(message, config);
                }
            } catch (error) {
                this.logger.error(error instanceof Error ? error.stack : error);
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

        const role: Role = (await interaction.guild?.roles.fetch(config.acceptedRoleId))!;
        if (!role) {
            return interaction.reply({ content: `Cannot find role with id ${config.acceptedRoleId}.` });
        }

        for (const member of await interaction.guild?.members.cache.values() ?? []) {
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role, "Permission revoked by person.");
            }
        }

        return interaction.reply({ content: "Done", ephemeral: true });
    }

    public async registerMessage(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
        const config: RoleManagerConfig = await this.findOneOrCreate(interaction.guildId);
        const message_id: string = interaction.options.getString("message_id")!;

        const channel: TextChannel = await interaction.guild?.channels.fetch(config.reactionListeningChannel) as TextChannel;

        if (!channel) {
            this.logger.debug(`Expected failure: Could not find channel.`);
            return interaction.reply({
                content: "Listening channel was not set. Kindly set the channel before you attempt to register a message.",
                ephemeral: true
            });
        }

        const message: Message = await channel.messages.fetch(message_id);

        if (!message) {
            this.logger.debug(`Expected failure: Could not find message.`);
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

    public async unregisterMessage(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
        const config: RoleManagerConfig = await this.findOneOrCreate(interaction.guildId);
        const message_id: string = interaction.options.getString("message_id")!;

        const channel: TextChannel = await interaction.guild?.channels.fetch(config.reactionListeningChannel) as TextChannel;

        if (!channel) {
            this.logger.debug(`Expected failure: Could not find channel.`);
            return interaction.reply({
                content: "Listening channel was not set. Kindly set the channel before you attempt to register a message.",
                ephemeral: true
            });
        }

        const message: Message = await channel.messages.fetch(message_id);

        if (!message) {
            this.logger.debug(`Expected failure: Could not find message.`);
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

    private async findOneOrCreate(id: string | null): Promise<RoleManagerConfig> {
        if (!id) {
            throw new Error("Guild Id cannot be null.");
        }

        let result = await this.roleManagerConfigRepository.findOne({ guildId: id });
        if (result) return result;

        result = new RoleManagerConfig();
        result.guildId = id;

        return await this.roleManagerConfigRepository.save(result);
    }
}
