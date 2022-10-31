import { CommandInteraction, MessageReaction, User, InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { Client } from "../utils/models/client.js";
import { RoleManagerRepository } from "../repositories/roleManager.repository.js";
export declare class RoleManagerService {
    private roleManagerConfigRepository;
    private logger;
    private collectors;
    constructor(roleManagerConfigRepository: RoleManagerRepository, logger: pino.Logger);
    private static alterMembersRoles;
    private static processMessageReactions;
    private registerReactionCollector;
    onReady(client: Client): Promise<void>;
    onReactionAdd(messageReaction: MessageReaction, user: User): Promise<void>;
    revokeRole(interaction: CommandInteraction): Promise<InteractionResponse<boolean>>;
    registerMessage(interaction: ChatInputCommandInteraction): Promise<InteractionResponse>;
    unregisterMessage(interaction: ChatInputCommandInteraction): Promise<InteractionResponse>;
    private findOneOrCreate;
}
//# sourceMappingURL=roleManager.service.d.ts.map