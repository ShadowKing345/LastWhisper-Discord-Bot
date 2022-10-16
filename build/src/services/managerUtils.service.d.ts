import { GuildBan, GuildMember, InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { ManagerUtilsRepository } from "../repositories/managerUtils.repository.js";
export declare class ManagerUtilsService {
    private managerUtilsConfigRepository;
    constructor(managerUtilsConfigRepository: ManagerUtilsRepository);
    private getLoggingChannel;
    onMemberRemoved(member: GuildMember): Promise<void>;
    onMemberBanned(ban: GuildBan): Promise<void>;
    private findOneOrCreate;
    clearChannelMessages(interaction: ChatInputCommandInteraction): Promise<InteractionResponse>;
}
//# sourceMappingURL=managerUtils.service.d.ts.map