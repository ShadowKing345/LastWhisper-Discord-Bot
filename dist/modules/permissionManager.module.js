var PermissionManagerModule_1;
import { __decorate, __metadata, __param } from "tslib";
import { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { ModuleBase } from "../utils/models/index.js";
import { PermissionMode, Permission } from "../models/permission_manager/index.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule, addPermissionKeys, authorize, deferReply } from "../utils/decorators/index.js";
import { Command, CommandOption } from "../utils/objects/command.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
import { BadAuthorizationKeyError } from "../utils/errors/index.js";
let PermissionManagerModule = PermissionManagerModule_1 = class PermissionManagerModule extends ModuleBase {
    service;
    static permissionKeys = {
        list: "PermissionManager.list",
        addRole: "PermissionManager.addRole",
        removeRole: "PermissionManager.removeRole",
        config: "PermissionManager.config",
        reset: "PermissionManager.reset"
    };
    moduleName = "PermissionManager";
    commands = [
        new Command({
            name: "permissions",
            description: "Controls the permission for each command.",
            subcommands: {
                List: new Command({
                    name: "list",
                    description: "Lists out all permissions.",
                    options: [PermissionManagerModule_1.commandKeyHelperBuilder(false)]
                }),
                AddRole: new Command({
                    name: "add_role",
                    description: "Adds a role to a permission setting.",
                    options: [
                        PermissionManagerModule_1.commandKeyHelperBuilder(true),
                        new CommandOption({
                            name: "role",
                            description: "Role to be added.",
                            required: true,
                            type: ApplicationCommandOptionType.Role
                        })
                    ]
                }),
                RemoveRole: new Command({
                    name: "remove_role",
                    description: "Removes a role to a permission setting.",
                    options: [
                        PermissionManagerModule_1.commandKeyHelperBuilder(true),
                        new CommandOption({
                            name: "role",
                            description: "Role to be added.",
                            required: true,
                            type: ApplicationCommandOptionType.Role
                        })
                    ]
                }),
                Config: new Command({
                    name: "set_config",
                    description: "Configures a permission.",
                    options: [
                        PermissionManagerModule_1.commandKeyHelperBuilder(true),
                        new CommandOption({
                            name: "mode",
                            description: "Sets the search mode for the command. Any: has any. Strict: has all.",
                            required: true,
                            choices: [
                                { name: "any", value: PermissionMode.ANY },
                                { name: "strict", value: PermissionMode.STRICT }
                            ],
                            type: ApplicationCommandOptionType.Integer
                        }),
                        new CommandOption({
                            name: "black_list",
                            description: "Reverses the final result. I.e. If list is empty, no one can use the command.",
                            type: ApplicationCommandOptionType.String
                        })
                    ]
                }),
                Reset: new Command({
                    name: "reset",
                    description: "Resets a permission to the default parameters.",
                    options: [PermissionManagerModule_1.commandKeyHelperBuilder(true)]
                })
            },
            execute: this.commandResolver.bind(this)
        })
    ];
    commandResolverKeys = {
        "permissions.list": this.listPermissions.bind(this)
    };
    constructor(service, logger) {
        super(service, logger);
        this.service = service;
    }
    async commandResolver(interaction) {
        const f = await super.commandResolver(interaction, false);
        const key = interaction.options.getString("key");
        const role = interaction.options.getRole("role");
        if (f instanceof Function) {
            return f(interaction, key, role);
        }
        else {
            return f;
        }
    }
    async listPermissions(interaction) {
        this.logger.debug(`Permission key list requested by guild ${interaction.guildId}.`);
        const key = interaction.options.getString("key");
        if (key) {
            this.logger.debug(`Detailed request information for key ${key}.`);
            try {
                const permission = await this.service.getPermission(interaction.guildId, key) ?? new Permission();
                this.logger.debug("Permissions found returning parsed object.");
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder({
                            title: `Settings for Permission ${key}`,
                            fields: [
                                {
                                    name: "Mode",
                                    value: permission.modeEnum
                                },
                                {
                                    name: "Is Blacklist",
                                    value: String(permission.blackList)
                                },
                                {
                                    name: "Roles",
                                    value: permission.roles.length > 0 ? (await Promise.allSettled(permission.fetchRoleNames(interaction.guild))).join("\n") : "No roles were set."
                                }
                            ]
                        }).setColor("Random")
                    ]
                });
            }
            catch (error) {
                if (error instanceof BadAuthorizationKeyError) {
                    this.logger.debug("Bad authorization key was given. Exiting.");
                    await interaction.editReply({ content: "Cannot find key. Please input a correct key. Use the list command to find out which keys are available." });
                }
                throw error;
            }
        }
        else {
            this.logger.debug("Key not specified. Returning all available keys.");
            await interaction.editReply({
                embeds: [new EmbedBuilder({
                        title: "List of PermissionKeys",
                        description: `\`\`\`\n${PermissionManagerService.keysFormatted}\n\`\`\``
                    }).setColor("Random")]
            });
        }
    }
    static commandKeyHelperBuilder(boolOverride = true) {
        return new CommandOption({
            name: "key",
            description: "Command permission Key.",
            required: boolOverride,
            type: ApplicationCommandOptionType.String
        });
    }
};
__decorate([
    authorize(PermissionManagerModule_1.permissionKeys.list),
    deferReply(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], PermissionManagerModule.prototype, "listPermissions", null);
__decorate([
    addPermissionKeys(),
    __metadata("design:type", Object)
], PermissionManagerModule, "permissionKeys", void 0);
PermissionManagerModule = PermissionManagerModule_1 = __decorate([
    registerModule(),
    __param(1, createLogger(PermissionManagerModule_1.name)),
    __metadata("design:paramtypes", [PermissionManagerService, Object])
], PermissionManagerModule);
export { PermissionManagerModule };
//# sourceMappingURL=permissionManager.module.js.map