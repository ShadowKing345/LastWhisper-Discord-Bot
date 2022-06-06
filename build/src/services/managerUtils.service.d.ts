import { GuildBan, GuildMember } from "discord.js";
import { ManagerUtilsConfigRepository } from "../repositories/managerUtilsConfig.repository.js";
export declare class ManagerUtilsService {
    private managerUtilsConfigRepository;
    constructor(managerUtilsConfigRepository: ManagerUtilsConfigRepository);
    private getLoggingChannel;
    onMemberRemoved(member: GuildMember): Promise<void>;
    onMemberBanned(ban: GuildBan): Promise<void>;
    private findOneOrCreate;
}
//# sourceMappingURL=managerUtils.service.d.ts.map