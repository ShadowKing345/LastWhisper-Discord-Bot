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
var PermissionManagerService_1;
import { EmbedBuilder } from "discord.js";
import { pino } from "pino";
import { singleton } from "tsyringe";
import { createLogger } from "../utils/loggerService.js";
import { Permission, PermissionManagerConfig, PermissionMode } from "../models/permission_manager/index.js";
import { PermissionManagerRepository } from "../repositories/permissionManager.repository.js";
import { unflattenObject } from "../utils/index.js";
/**
 * Service that manages the permissions of commands throughout the project.
 * The reason for this service is that while you are able to change certain permissions for regular slash commands, subcommands cannot have their permissions changed in the same way.
 */
let PermissionManagerService = PermissionManagerService_1 = class PermissionManagerService {
    permissionManagerRepository;
    logger;
    static keys = [];
    static _keysFormatted = null;
    constructor(permissionManagerRepository, logger) {
        this.permissionManagerRepository = permissionManagerRepository;
        this.logger = logger;
    }
    /**
     * Checks if a member is authorized to use the given key of a command.
     * @param interaction The interaction used to determine the rights.
     * @param key The name of the key to check against.
     */
    async isAuthorized(interaction, key) {
        this.logger.debug(`Attempting to authorize for key ${key}`);
        if (!PermissionManagerService_1.keyExists(key)) {
            this.logger.debug(`Expected Failure: Could not find key.`);
            return false;
        }
        if (!interaction) {
            this.logger.debug(`Expected Failure: Interaction is null.`);
            return false;
        }
        // The guild owner should always be allowed to use commands to prevent a lockout scenario.
        if (interaction.guild.ownerId === interaction.user.id) {
            this.logger.debug(`User is owner. Returning true.`);
            return true;
        }
        const config = await this.findOneOrCreate(interaction.guildId);
        // Todo: fix missing permissions.
        const permission = config.permissions[key] ?? new Permission();
        let result;
        if (permission.roles.length === 0) {
            this.logger.debug(`Length is 0. Flag set to true.`);
            result = true;
        }
        else {
            const user = await interaction.guild.members.fetch(interaction.user.id);
            switch (permission.mode) {
                case PermissionMode.STRICT:
                    result = user.roles.cache.hasAll(...permission.roles);
                    break;
                case PermissionMode.ANY:
                default:
                    result = user.roles.cache.hasAny(...permission.roles);
                    break;
            }
        }
        const authorized = (!permission.blackList && result) || (permission.blackList && !result);
        this.logger.debug(`User is ${authorized ? "Authenticated" : "Unauthenticated"}.`);
        return authorized;
    }
    /**
     * Adds a role to a permission.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission
     * @param role The role.
     */
    async addRole(interaction, key, role) {
        if (!PermissionManagerService_1.keyExists(key)) {
            return interaction.reply({
                content: "Cannot find key. Please input the correct key.",
                ephemeral: true,
            });
        }
        const config = await this.findOneOrCreate(interaction.guildId);
        const permissions = config.permissions[key] ??= new Permission();
        if (permissions.roles.includes(role.id)) {
            return interaction.reply({
                content: `Role is already there. Will not add again.`,
                ephemeral: true,
            });
        }
        permissions.roles.push(role.id);
        await this.permissionManagerRepository.save(config);
        return interaction.reply({
            content: `Role added to key ${key}`,
            ephemeral: true,
        });
    }
    /**
     * Removes a role from a permission.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission
     * @param role The role.
     */
    async removeRole(interaction, key, role) {
        if (!PermissionManagerService_1.keyExists(key)) {
            return interaction.reply({
                content: "Cannot find key. Please input the correct key.",
                ephemeral: true,
            });
        }
        const config = await this.findOneOrCreate(interaction.guildId);
        const permission = config.permissions[key];
        if (!permission) {
            return interaction.reply({ content: `Cannot find key ${key}`, ephemeral: true });
        }
        const index = permission.roles.findIndex(r => r === role.id);
        if (index === -1) {
            return interaction.reply({
                content: `Cannot find role ${role.name} in the permission list ${key}`,
                ephemeral: true,
            });
        }
        permission.roles.splice(index, 1);
        await this.permissionManagerRepository.save(config);
        return interaction.reply({
            content: `Role removed for key ${key}`,
            ephemeral: true,
        });
    }
    /**
     * Configures a permission.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission
     */
    async config(interaction, key) {
        if (!PermissionManagerService_1.keyExists(key)) {
            return interaction.reply({
                content: "Cannot find key. Please input the correct key.",
                ephemeral: true,
            });
        }
        const config = await this.findOneOrCreate(interaction.guildId);
        const permission = config.permissions[key] ??= new Permission();
        const mode = interaction.options.getInteger("mode", false);
        if (mode != null) {
            permission.mode = mode;
        }
        const black_list = interaction.options.getBoolean("black_list");
        if (black_list != null) {
            permission.blackList = black_list;
        }
        await this.permissionManagerRepository.save(config);
        return interaction.reply({
            content: "Config set.",
            ephemeral: true,
        });
    }
    /**
     * Resets all permission options and roles set.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission
     */
    async reset(interaction, key) {
        if (!PermissionManagerService_1.keyExists(key)) {
            return interaction.reply({
                content: "Cannot find key. Please input the correct key.",
                ephemeral: true,
            });
        }
        const config = await this.findOneOrCreate(interaction.guildId);
        if (!config.permissions[key]) {
            return interaction.reply({
                content: `Cannot find permissions with key ${key}`,
                ephemeral: true,
            });
        }
        delete config.permissions[key];
        await this.permissionManagerRepository.save(config);
        return interaction.reply({
            content: `Permission ${key} was successfully reset (deleted).`,
            ephemeral: true,
        });
    }
    /**
     * List all permissions keys.
     * If key is set then it gives a detailed view of that permission settings.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission (optional)
     */
    async listPermissions(interaction, key) {
        if (key) {
            if (!PermissionManagerService_1.keyExists(key)) {
                return interaction.reply({
                    content: "Cannot find key. Please input the correct key.",
                    ephemeral: true,
                });
            }
            const config = await this.findOneOrCreate(interaction.guildId);
            const permission = config.permissions[key] ?? new Permission();
            return interaction.reply({
                embeds: [new EmbedBuilder({
                        title: `Settings for Permission ${key}`,
                        description: `\`\`\`\nMode:\t\t${PermissionMode[permission.mode]},\nBlacklist:   ${permission.blackList},\nRoles:\t   [ ${permission.roles.join(", ")} ]\n\`\`\``,
                    }).setColor("Random")],
                ephemeral: true,
            });
        }
        else {
            return interaction.reply({
                embeds: [new EmbedBuilder({
                        title: "List of PermissionKeys",
                        description: `\`\`\`\n${PermissionManagerService_1.keysFormatted}\n\`\`\``,
                    }).setColor("Random")],
                ephemeral: true,
            });
        }
    }
    /**
     * Finds a config file or creates one.
     * @param id Id for the guild.
     * @private
     */
    async findOneOrCreate(id) {
        let result = await this.permissionManagerRepository.findOne({ guildId: id });
        if (result)
            return result;
        result = new PermissionManagerConfig();
        result.guildId = id;
        return await this.permissionManagerRepository.save(result);
    }
    /**
     * Adds a permission key to the list of keys.
     * @param key The key to be added.
     */
    static addPermissionKey(key) {
        if (!PermissionManagerService_1.keyExists(key)) {
            PermissionManagerService_1.keys.push(key);
        }
    }
    /**
     * Removes a permission from the list of keys.
     * @param key The key to be removed.
     */
    static removePermissionKey(key) {
        if (PermissionManagerService_1.keyExists(key)) {
            PermissionManagerService_1.keys.splice(PermissionManagerService_1.keys.indexOf(key), 1);
        }
    }
    /**
     * Checks to see if a key already exists.
     * @param key The key to check.
     * @private
     */
    static keyExists(key) {
        return PermissionManagerService_1.keys.includes(key);
    }
    /**
     * Creates or returns a formatted text of the keys.
     * Normalizes to be more readable.
     */
    static get keysFormatted() {
        if (PermissionManagerService_1._keysFormatted) {
            return PermissionManagerService_1._keysFormatted;
        }
        const obj = unflattenObject(PermissionManagerService_1.keys.reduce((previousValue, currentValue) => {
            previousValue[currentValue] = currentValue;
            return previousValue;
        }, {}));
        function format(obj, index = 0) {
            const spaces = "\t".repeat(index);
            let result = "";
            for (const [key, value] of Object.entries(obj)) {
                result += typeof value === "object" ? `${spaces}${key}:\n${format(value, index + 1)}` : `${spaces}${key};\n`;
            }
            return result;
        }
        return PermissionManagerService_1._keysFormatted = format(obj);
    }
};
PermissionManagerService = PermissionManagerService_1 = __decorate([
    singleton(),
    __param(1, createLogger(PermissionManagerService_1.name)),
    __metadata("design:paramtypes", [PermissionManagerRepository, Object])
], PermissionManagerService);
export { PermissionManagerService };
//# sourceMappingURL=permissionManager.service.js.map