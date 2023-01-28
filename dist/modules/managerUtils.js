var ManagerUtilsModule_1;
import { __decorate, __metadata } from "tslib";
import { Module } from "./module.js";
import { ManagerUtilsService } from "../services/managerUtils.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { module } from "../decorators/index.js";
import { SlashCommand, CommandOption } from "../objects/slashCommand.js";
import { EventListener } from "../objects/eventListener.js";
import { Logger } from "../config/logger.js";
let ManagerUtilsModule = ManagerUtilsModule_1 = class ManagerUtilsModule extends Module {
    managerUtilsService;
    logger = new Logger(ManagerUtilsModule_1);
    moduleName = "ManagerUtils";
    commands = [
        new SlashCommand({
            name: "manager_utils",
            description: "Utility functions for managers.",
            subcommands: {
                Clear: new SlashCommand({
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
            execute: interaction => this.commandResolver(interaction),
        }),
    ];
    eventListeners = [
        new EventListener("guildBanAdd", (_, [member]) => this.onMemberBanned(member)),
        new EventListener("guildMemberRemove", async (_, [member]) => await this.onMemberRemoved(member)),
    ];
    commandResolverKeys = {
        "manager_utils.clear": this.clear.bind(this),
    };
    constructor(managerUtilsService, permissionManagerService) {
        super(permissionManagerService);
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
    module(),
    __metadata("design:paramtypes", [ManagerUtilsService,
        PermissionManagerService])
], ManagerUtilsModule);
export { ManagerUtilsModule };
//# sourceMappingURL=managerUtils.js.map