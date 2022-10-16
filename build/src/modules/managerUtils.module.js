var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ManagerUtilsModule_1;
import { ModuleBase } from "../utils/models/index.js";
import { ManagerUtilsService } from "../services/managerUtils.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { CommandBuilder, CommandBuilderOption } from "../utils/objects/commandBuilder.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
let ManagerUtilsModule = ManagerUtilsModule_1 = class ManagerUtilsModule extends ModuleBase {
    managerUtilsService;
    moduleName = "ManagerUtils";
    commands = [new CommandBuilder({
            name: "manager_utils",
            description: "Utility functions for managers.",
            subcommands: {
                Clear: {
                    name: "clear",
                    description: "Clears a channel of its messages.",
                    options: [
                        new CommandBuilderOption({
                            name: "amount",
                            description: "The amount of messages to clear. Default 10.",
                        }),
                    ],
                },
            },
            execute: interaction => this.commandResolver(interaction),
        })];
    listeners = [
        { event: "guildBanAdd", run: async (_, member) => await this.onMemberBanned(member) },
        { event: "guildMemberRemove", run: async (client, member) => await this.onMemberRemoved(member) },
    ];
    commandResolverKeys = {
        "manager_utils.clear": this.clear,
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