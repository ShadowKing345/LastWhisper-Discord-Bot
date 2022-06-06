import { CommandInteraction, MessageReaction, User } from "discord.js";
import { Client } from "../classes/client.js";
import { RoleManagerConfigRepository } from "../repositories/roleManagerConfig.repository.js";
export declare class RoleManagerService {
    private roleManagerConfigRepository;
    private readonly logger;
    private collectors;
    constructor(roleManagerConfigRepository: RoleManagerConfigRepository);
    private static alterMembersRoles;
    private static processMessageReactions;
    private registerReactionCollector;
    onReady(client: Client): Promise<void>;
    onReactionAdd(messageReaction: MessageReaction, user: User): Promise<void>;
    revokeRole(interaction: CommandInteraction): Promise<void>;
    registerMessage(interaction: CommandInteraction): Promise<void>;
    unregisterMessage(interaction: CommandInteraction): Promise<void>;
    private findOneOrCreate;
}
//# sourceMappingURL=roleManager.service.d.ts.map