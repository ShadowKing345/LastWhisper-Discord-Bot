import { GuildBan, GuildMember } from "discord.js";
import { injectable } from "tsyringe";

import { ModuleBase } from "../classes/moduleBase.js";
import { ManagerUtilsService } from "../services/managerUtils.service.js";

@injectable()
export class ManagerUtilsModule extends ModuleBase {

    constructor(private managerUtilsService: ManagerUtilsService) {
        super();

        this.moduleName = "ManagerUtils";
        this.listeners = [
            { event: "guildBanAdd", run: async (_, member) => await this.onMemberBanned(member) },
            { event: "guildMemberRemove", run: async (client, member) => await this.onMemberRemoved(member) },
        ];
    }

    private onMemberRemoved(member: GuildMember): Promise<void> {
        return this.managerUtilsService.onMemberRemoved(member);
    }

    private onMemberBanned(ban: GuildBan): Promise<void> {
        return this.managerUtilsService.onMemberBanned(ban);
    }
}
