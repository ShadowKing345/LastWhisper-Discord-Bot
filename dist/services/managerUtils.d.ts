import { GuildBan, GuildMember, InteractionResponse, ChatInputCommandInteraction, PartialGuildMember } from "discord.js";
import { ManagerUtilsConfig } from "../entities/managerUtils.js";
import { ManagerUtilsRepository } from "../repositories/managerUtils.js";
import { Service } from "../utils/objects/service.js";
export declare class ManagerUtilsService extends Service<ManagerUtilsConfig> {
    constructor(repository: ManagerUtilsRepository);
    private getLoggingChannel;
    onMemberRemoved(member: GuildMember | PartialGuildMember): Promise<void>;
    onMemberBanned(ban: GuildBan): Promise<void>;
    clearChannelMessages(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
}
//# sourceMappingURL=managerUtils.d.ts.map