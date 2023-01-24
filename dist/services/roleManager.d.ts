import { CommandInteraction, MessageReaction, User, InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { Bot } from "../utils/objects/bot.js";
import { RoleManagerRepository } from "../repositories/roleManager.js";
import { Service } from "./service.js";
export declare class RoleManagerService extends Service {
    private repository;
    private logger;
    private collectors;
    constructor(repository: RoleManagerRepository);
    private static alterMembersRoles;
    private static processMessageReactions;
    private registerReactionCollector;
    onReady(client: Bot): Promise<void>;
    onReactionAdd(messageReaction: MessageReaction, user: User): Promise<void>;
    revokeRole(interaction: CommandInteraction): Promise<InteractionResponse<boolean>>;
    registerMessage(interaction: ChatInputCommandInteraction): Promise<InteractionResponse>;
    unregisterMessage(interaction: ChatInputCommandInteraction): Promise<InteractionResponse>;
}
//# sourceMappingURL=roleManager.d.ts.map