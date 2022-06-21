var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ManagerUtilsModule_1;
import { CommandInteraction } from "discord.js";
import { singleton } from "tsyringe";
import { addCommandKeys, authorize, PermissionManagerService } from "../permission_manager/index.js";
import { ModuleBase } from "../shared/models/moduleBase.js";
import { ManagerUtilsService } from "./managerUtils.service.js";
let ManagerUtilsModule = ManagerUtilsModule_1 = class ManagerUtilsModule extends ModuleBase {
    managerUtilsService;
    permissionManager;
    static commands = {
        $index: "manager_utils",
        Clear: "clear",
    };
    constructor(managerUtilsService, permissionManager) {
        super();
        this.managerUtilsService = managerUtilsService;
        this.permissionManager = permissionManager;
        this.moduleName = "ManagerUtils";
        this.commands = [{
                command: builder => builder
                    .setName(ManagerUtilsModule_1.commands.$index)
                    .setDescription("Utility functions for managers.")
                    .addSubcommand(subcommandGroup => subcommandGroup
                    .setName(ManagerUtilsModule_1.commands.Clear)
                    .setDescription("Clears a channel of its messages.")
                    .addNumberOption(option => option
                    .setName("amount")
                    .setDescription("The amount of messages to clear. Default 10.")
                    .setRequired(false))),
                run: interaction => this.subcommandResolver(interaction)
            }];
        this.listeners = [
            { event: "guildBanAdd", run: async (_, member) => await this.onMemberBanned(member) },
            { event: "guildMemberRemove", run: async (client, member) => await this.onMemberRemoved(member) },
        ];
    }
    onMemberRemoved(member) {
        return this.managerUtilsService.onMemberRemoved(member);
    }
    onMemberBanned(ban) {
        return this.managerUtilsService.onMemberBanned(ban);
    }
    subcommandResolver(interaction) {
        if (!interaction.guildId) {
            return interaction.reply({
                content: "Sorry you cannot use this command outside of a server.",
                ephemeral: true,
            });
        }
        const subcommand = interaction.options.getSubcommand();
        if (!subcommand || subcommand !== ManagerUtilsModule_1.commands.Clear) {
            return interaction.reply({
                content: "Cannot find subcommand.",
                ephemeral: true,
            });
        }
        return this.clearChannelMessages(interaction);
    }
    clearChannelMessages(interaction) {
        return this.managerUtilsService.clearChannelMessages(interaction);
    }
};
__decorate([
    authorize(ManagerUtilsModule_1.commands.$index, ManagerUtilsModule_1.commands.Clear),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], ManagerUtilsModule.prototype, "clearChannelMessages", null);
__decorate([
    addCommandKeys(),
    __metadata("design:type", Object)
], ManagerUtilsModule, "commands", void 0);
ManagerUtilsModule = ManagerUtilsModule_1 = __decorate([
    singleton(),
    __metadata("design:paramtypes", [ManagerUtilsService,
        PermissionManagerService])
], ManagerUtilsModule);
export { ManagerUtilsModule };
//# sourceMappingURL=managerUtils.module.js.map