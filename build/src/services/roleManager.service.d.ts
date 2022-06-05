import { MessageReaction, User } from "discord.js";
import { Client } from "../classes/client.js";
import { RoleManagerConfigRepository } from "../repositories/roleManagerConfig.repository.js";
export declare class RoleManagerService {
    private repo;
    constructor(repo: RoleManagerConfigRepository);
    private static alterMembersRoles;
    private getConfig;
    onReady(client: Client): Promise<void>;
    onReactionAdd(messageReaction: MessageReaction, user: User): Promise<void>;
    private findOneOrCreate;
}
//# sourceMappingURL=roleManager.service.d.ts.map