var ManagerUtilsModule_1;
import { __decorate, __metadata, __param } from "tslib";
import { ModuleBase } from "../utils/models/index.js";
import { ManagerUtilsService } from "../services/managerUtils.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { Command, CommandOption } from "../utils/objects/command.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
import { EventListener } from "../utils/objects/eventListener.js";
let ManagerUtilsModule = ManagerUtilsModule_1 = class ManagerUtilsModule extends ModuleBase {
    managerUtilsService;
    moduleName = "ManagerUtils";
    commands = [
        new Command({
            name: "manager_utils",
            description: "Utility functions for managers.",
            subcommands: {
                Clear: new Command({
                    name: "clear",
                    description: "Clears a channel of its messages.",
                    options: [
                        new CommandOption({
                            name: "amount",
                            description: "The amount of messages to clear. Default 10.",
                        }),
                    ],
                }),
            },
            execute: (interaction) => this.commandResolver(interaction),
        }),
    ];
    eventListeners = [
        new EventListener("guildBanAdd", (_, [member]) => this.onMemberBanned(member)),
        new EventListener("guildMemberRemove", async (_, [member]) => await this.onMemberRemoved(member)),
    ];
    commandResolverKeys = {
        "manager_utils.clear": this.clear.bind(this),
    };
    constructor(managerUtilsService, permissionManagerService, logger) {
        super(permissionManagerService, logger);
        this.managerUtilsService = managerUtilsService;
    }
    onMemberRemoved(member) {
        return this.managerUtilsService.onMemberRemoved(member);
    }
    onMemberBanned(ban) {
        return this.managerUtilsService.onMemberBanned(ban);
    }
    clear(interaction) {
        return this.managerUtilsService.clearChannelMessages(interaction);
    }
};
ManagerUtilsModule = ManagerUtilsModule_1 = __decorate([
    registerModule(),
    __param(2, createLogger(ManagerUtilsModule_1.name)),
    __metadata("design:paramtypes", [ManagerUtilsService,
        PermissionManagerService, Object])
], ManagerUtilsModule);
export { ManagerUtilsModule };
//# sourceMappingURL=managerUtils.module.js.map