import { Guild, GuildMember, Message, MessageReaction, Role, User } from "discord.js";
import { injectable } from "tsyringe";

import { Client } from "../classes/client.js";
import { RoleManagerConfig } from "../models/roleManager.model.js";
import { RoleManagerConfigRepository } from "../repositories/roleManagerConfig.repository.js";
import { fetchMessages } from "../utils/utils.js";

@injectable()
export class RoleManagerService {

    constructor(private repo: RoleManagerConfigRepository) {
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

    private async getConfig(guildId: string): Promise<RoleManagerConfig> {
        return this.findOneOrCreate(guildId);
    }

    public async onReady(client: Client) {
        const configs: RoleManagerConfig[] = await this.repo.getAll();

        for (const config of configs) {
            if (!client.guilds.cache.has(config.guildId)) continue;
            if (!config.reactionListeningChannel || !config.reactionMessageIds.length) continue;
            const messages: Message[] | void = await fetchMessages(client, config.guildId, config.reactionListeningChannel, config.reactionMessageIds).catch(error => console.error(error));

            if (!messages) continue;
            const guild: Guild | null = await client.guilds.fetch(config.guildId);
            if (!guild) continue;

            const filter = (reaction: MessageReaction) => config.reactionMessageIds.includes(reaction.message.id);

            for (const message of messages) {
                for (const reaction of message.reactions.cache.values()) {
                    await reaction.users.fetch();
                    for (const user of reaction.users.cache.values()) {
                        try {
                            const member: GuildMember | null = await guild.members.fetch(user.id);
                            if (member) await RoleManagerService.alterMembersRoles(member, config.acceptedRole);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }

                await message.reactions.removeAll();
                message.createReactionCollector({ filter }).on("collect", (messageReaction, user) => this.onReactionAdd(messageReaction, user));
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

        const config: RoleManagerConfig = await this.getConfig(guild.id);
        await RoleManagerService.alterMembersRoles(member, config.acceptedRole);

        await messageReaction.remove();
    }

    private async findOneOrCreate(id: string): Promise<RoleManagerConfig> {
        let result = await this.repo.findOne({ guildId: id });
        if (result) return result;

        result = new RoleManagerConfig();
        result.guildId = id;

        return await this.repo.save(result);
    }
}
