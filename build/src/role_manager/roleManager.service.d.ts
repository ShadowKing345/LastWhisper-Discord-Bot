import { CommandInteraction, MessageReaction, User } from "discord.js";
import { Client } from "../shared/models/client.js";
import { RoleManagerRepository } from "./roleManager.repository.js";
export declare class RoleManagerService {
    private roleManagerConfigRepository;
    private readonly logger;
    private collectors;
    constructor(roleManagerConfigRepository: RoleManagerRepository);
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