import { GuildBan, GuildMember, InteractionResponse, ChatInputCommandInteraction, PartialGuildMember } from "discord.js";
import { ManagerUtilsRepository } from "../repositories/managerUtils.repository.js";
export declare class ManagerUtilsService {
    private managerUtilsConfigRepository;
    constructor(managerUtilsConfigRepository: ManagerUtilsRepository);
    private getLoggingChannel;
    onMemberRemoved(member: GuildMember | PartialGuildMember): Promise<void>;
    onMemberBanned(ban: GuildBan): Promise<void>;
    private findOneOrCreate;
    clearChannelMessages(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
}
//# sourceMappingURL=managerUtils.service.d.ts.map