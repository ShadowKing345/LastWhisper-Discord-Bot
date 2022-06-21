import { CommandInteraction, GuildBan, GuildMember } from "discord.js";
import { ManagerUtilsRepository } from "./managerUtils.repository.js";
export declare class ManagerUtilsService {
    private managerUtilsConfigRepository;
    constructor(managerUtilsConfigRepository: ManagerUtilsRepository);
    private getLoggingChannel;
    onMemberRemoved(member: GuildMember): Promise<void>;
    onMemberBanned(ban: GuildBan): Promise<void>;
    private findOneOrCreate;
    clearChannelMessages(interaction: CommandInteraction): Promise<void>;
}
//# sourceMappingURL=managerUtils.service.d.ts.map