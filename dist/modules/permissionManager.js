var PermissionManagerModule_1;
import { __decorate, __metadata, __param } from "tslib";
import { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Module } from "../utils/objects/index.js";
import { PermissionMode, Permission } from "../entities/permissionManager/index.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { module, addPermissionKeys, authorize, deferReply } from "../utils/decorators/index.js";
import { Command, CommandOption } from "../utils/objects/command.js";
import { createLogger } from "../services/loggerService.js";
import { pino } from "pino";
import { BadAuthorizationKeyError } from "../utils/errors/index.js";
let PermissionManagerModule = PermissionManagerModule_1 = class PermissionManagerModule extends Module {
    service;
    BadKeyErrorMessages = "Cannot find key. Please input a correct key. Use the list command to find out which keys are available.";
    static permissionKeys = {
        list: "PermissionManager.list",
        addRole: "PermissionManager.addRole",
        removeRole: "PermissionManager.removeRole",
        config: "PermissionManager.config",
        reset: "PermissionManager.reset",
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
                    options: [this.commandKeyHelperBuilder(false)],
                }),
                AddRole: new Command({
                    name: "add_role",
                    description: "Adds a role to a permission setting.",
                    options: [
                        this.commandKeyHelperBuilder(true),
                        new CommandOption({
                            name: "role",
                            description: "Role to be added.",
                            required: true,
                            type: ApplicationCommandOptionType.Role,
                        }),
                    ],
                }),
                RemoveRole: new Command({
                    name: "remove_role",
                    description: "Removes a role to a permission setting.",
                    options: [
                        this.commandKeyHelperBuilder(true),
                        new CommandOption({
                            name: "role",
                            description: "Role to be added.",
                            required: true,
                            type: ApplicationCommandOptionType.Role,
                        }),
                    ],
                }),
                Config: new Command({
                    name: "set_config",
                    description: "Configures a permission.",
                    options: [
                        this.commandKeyHelperBuilder(true),
                        new CommandOption({
                            name: "mode",
                            description: "Sets the search mode for the command. Any: has any. Strict: has all.",
                            required: true,
                            choices: [
                                { name: "any", value: PermissionMode.ANY },
                                { name: "strict", value: PermissionMode.STRICT },
                            ],
                            type: ApplicationCommandOptionType.Integer,
                        }),
                        new CommandOption({
                            name: "black_list",
                            description: "Reverses the final result. I.e. If list is empty, no one can use the command.",
                            type: ApplicationCommandOptionType.String,
                        }),
                    ],
                }),
                Reset: new Command({
                    name: "reset",
                    description: "Resets a permission to the default parameters.",
                    options: [this.commandKeyHelperBuilder(true)],
                }),
            },
            execute: this.commandResolver.bind(this),
        }),
    ];
    commandResolverKeys = {
        "permissions.add_role": this.addRole.bind(this),
        "permissions.remove_role": this.removeRole.bind(this),
        "permissions.set_config": this.config.bind(this),
        "permissions.reset": this.reset.bind(this),
        "permissions.list": this.listPermissions.bind(this),
    };
    constructor(service, logger) {
        super(service, logger);
        this.service = service;
    }
    async commandResolver(interaction) {
        try {
            await super.commandResolver(interaction);
        }
        catch (error) {
            if (error instanceof BadAuthorizationKeyError) {
                this.logger.debug("Bad authorization key was given. Exiting.");
                if (interaction.deferred) {
                    await interaction.editReply({ content: this.BadKeyErrorMessages });
                }
                else if (!interaction.replied) {
                    await interaction.reply({ content: this.BadKeyErrorMessages, ephemeral: true });
                }
            }
            throw error;
        }
    }
    async addRole(interaction) {
        this.logger.debug(`Add role command invoked for guild ${interaction.guildId}.`);
        const key = interaction.options.getString("key", true);
        const role = interaction.options.getRole("role", true);
        const permission = (await this.service.getPermission(interaction.guildId, key)) ?? new Permission();
        if (permission.roles.includes(role.id)) {
            await interaction.editReply({ content: `Role is already there. Will not add again.` });
        }
        permission.roles.push(role.id);
        await this.service.setPermission(interaction.guildId, key, permission);
        this.logger.debug("Role added successfully.");
        await interaction.editReply({ content: `Role added to key ${key}` });
    }
    async removeRole(interaction) {
        this.logger.debug(`Remove role command invoked for guild ${interaction.guildId}.`);
        const key = interaction.options.getString("key", true);
        const role = interaction.options.getRole("role", true);
        const permission = (await this.service.getPermission(interaction.guildId, key)) ?? new Permission();
        const index = permission.roles.findIndex(r => r === role.id);
        if (index < 0) {
            await interaction.editReply({ content: `Cannot find role ${role.name} in the permission list ${key}` });
        }
        permission.roles.splice(index, 1);
        await this.service.setPermission(interaction.guildId, key, permission);
        this.logger.debug("Role removed successfully.");
        await interaction.editReply({ content: `Role removed for key ${key}` });
    }
    async config(interaction) {
        this.logger.debug(`Config invoked for guild ${interaction.guildId}.`);
        const key = interaction.options.getString("key", true);
        const mode = interaction.options.getInteger("mode");
        const blackList = interaction.options.getBoolean("black_list");
        const permission = (await this.service.getPermission(interaction.guildId, key)) ?? new Permission();
        permission.merge({ mode, blackList });
        await this.service.setPermission(interaction.guildId, key, permission);
        this.logger.debug("Permission settings changed and saved.");
        await interaction.editReply({ content: "Configuration set." });
    }
    async reset(interaction) {
        this.logger.debug(`Reset invoked for guild ${interaction.guildId}.`);
        const key = interaction.options.getString("key", true);
        await this.service.setPermission(interaction.guildId, key, new Permission());
        this.logger.debug("Permissions were reset.");
        await interaction.editReply({ content: `Permission ${key} was successfully reset.` });
    }
    async listPermissions(interaction) {
        this.logger.debug(`Permission key list requested by guild ${interaction.guildId}.`);
        const key = interaction.options.getString("key");
        if (key) {
            this.logger.debug(`Detailed request information for key ${key}.`);
            const permission = (await this.service.getPermission(interaction.guildId, key)) ?? new Permission();
            this.logger.debug("Permissions found returning parsed object.");
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder({
                        title: `Settings for Permission ${key}`,
                        fields: [
                            {
                                name: "Mode",
                                value: `\`\`\`${permission.modeEnum}\`\`\``,
                            },
                            {
                                name: "Is Blacklist",
                                value: `\`\`\`${String(permission.blackList)}\`\`\``,
                            },
                            {
                                name: "Roles",
                                value: `\`\`\`${await permission.formatRoles(interaction.guild)}\`\`\``,
                            },
                        ],
                    }).setColor("Random"),
                ],
            });
        }
        else {
            this.logger.debug("Key not specified. Returning all available keys.");
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder({
                        title: "List of PermissionKeys",
                        description: `\`\`\`\n${PermissionManagerService.keysFormatted}\n\`\`\``,
                    }).setColor("Random"),
                ],
            });
        }
    }
    commandKeyHelperBuilder(boolOverride = true) {
        return new CommandOption({
            name: "key",
            description: "Command permission Key.",
            required: boolOverride,
            type: ApplicationCommandOptionType.String,
        });
    }
};
__decorate([
    authorize(PermissionManagerModule_1.permissionKeys.addRole),
    deferReply(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], PermissionManagerModule.prototype, "addRole", null);
__decorate([
    authorize(PermissionManagerModule_1.permissionKeys.removeRole),
    deferReply(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], PermissionManagerModule.prototype, "removeRole", null);
__decorate([
    authorize(PermissionManagerModule_1.permissionKeys.config),
    deferReply(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], PermissionManagerModule.prototype, "config", null);
__decorate([
    authorize(PermissionManagerModule_1.permissionKeys.reset),
    deferReply(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], PermissionManagerModule.prototype, "reset", null);
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
    module(),
    __param(1, createLogger(PermissionManagerModule_1.name)),
    __metadata("design:paramtypes", [PermissionManagerService, Object])
], PermissionManagerModule);
export { PermissionManagerModule };
//# sourceMappingURL=permissionManager.js.map