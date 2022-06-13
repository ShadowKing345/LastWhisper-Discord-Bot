import { GuildBan, GuildMember } from "discord.js";
import { singleton } from "tsyringe";

import { ModuleBase } from "../shared/models/moduleBase.js";
import { ManagerUtilsService } from "./managerUtils.service.js";

@singleton()
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
