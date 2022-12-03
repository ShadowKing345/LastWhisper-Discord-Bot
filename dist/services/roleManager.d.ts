import { CommandInteraction, MessageReaction, User, InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { Client } from "../utils/objects/client.js";
import { RoleManagerConfig } from "../entities/roleManager.js";
import { RoleManagerRepository } from "../repositories/roleManager.js";
import { Service } from "./service.js";
export declare class RoleManagerService extends Service<RoleManagerConfig> {
    private logger;
    private collectors;
    constructor(repository: RoleManagerRepository, logger: pino.Logger);
    private static alterMembersRoles;
    private static processMessageReactions;
    private registerReactionCollector;
    onReady(client: Client): Promise<void>;
    onReactionAdd(messageReaction: MessageReaction, user: User): Promise<void>;
    revokeRole(interaction: CommandInteraction): Promise<InteractionResponse<boolean>>;
    registerMessage(interaction: ChatInputCommandInteraction): Promise<InteractionResponse>;
    unregisterMessage(interaction: ChatInputCommandInteraction): Promise<InteractionResponse>;
}
//# sourceMappingURL=roleManager.d.ts.map