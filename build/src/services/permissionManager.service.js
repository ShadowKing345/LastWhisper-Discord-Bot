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
import { MessageEmbed } from "discord.js";
import { pino } from "pino";
import { singleton } from "tsyringe";
import { createLogger } from "../utils/logger/logger.decorator.js";
import { deepMerge } from "../utils/index.js";
import { PermissionKeys } from "../permission_manager/addCommandKeys.decorator.js";
import { Permission, PermissionManagerConfig, PermissionMode } from "../models/permission_manager/index.js";
import { PermissionManagerRepository } from "../repositories/permissionManager.repository.js";
let PermissionManagerService = PermissionManagerService_1 = class PermissionManagerService {
    permissionManagerRepository;
    logger;
    constructor(permissionManagerRepository, logger) {
        this.permissionManagerRepository = permissionManagerRepository;
        this.logger = logger;
    }
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
        if (interaction.guild.ownerId === interaction.user.id) {
            this.logger.debug(`User is owner. Returning true.`);
            return true;
        }
        const config = await this.findOneOrCreate(interaction.guildId);
        const permission = deepMerge(new Permission(), config.permissions[key] ?? new Permission());
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
        this.logger.debug(`User is ${result && !permission.blackList ? "Authenticated" : "Unauthenticated"}.`);
        return permission.blackList ? !result : result;
    }
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
                embeds: [new MessageEmbed({
                        title: `Settings for Permission ${key}`,
                        description: `\`\`\`\nMode:\t\t${PermissionMode[permission.mode]},\nBlacklist:   ${permission.blackList},\nRoles:\t   [ ${permission.roles.join(", ")} ]\n\`\`\``,
                        color: "RANDOM",
                    })],
                ephemeral: true,
            });
        }
        else {
            const result = `\`\`\`\n${PermissionKeys
                .map((key) => key instanceof Object ? `${key.$index} {\n\t${Object.entries(key)
                .filter(([k]) => k !== "$index")
                .map(([, v]) => v instanceof Object ?
                `${v.$index} {\n\t\t${Object.entries(v)
                    .filter(([k]) => k !== "$index")
                    .map(([, v]) => v)
                    .join(",\n\t\t")}\n\t}`
                : v)
                .join(",\n\t")}\n}` : key)
                .join(",\n")}\n\`\`\``;
            return interaction.reply({
                embeds: [new MessageEmbed({
                        title: "List of PermissionKeys",
                        description: result,
                        color: "RANDOM",
                    })],
                ephemeral: true,
            });
        }
    }
    async findOneOrCreate(id) {
        let result = await this.permissionManagerRepository.findOne({ guildId: id });
        if (result)
            return result;
        result = new PermissionManagerConfig();
        result.guildId = id;
        return await this.permissionManagerRepository.save(result);
    }
    static addPermissionKeys(keys) {
        PermissionKeys.push(keys);
    }
    static removePermissionKey(prefix) {
        PermissionKeys.splice(PermissionKeys.findIndex(key => (key instanceof Object ? key.$index : key) === prefix), 1);
    }
    static keyExists(key) {
        const keys = key.split(".");
        const item = PermissionKeys.find(item => (item instanceof Object ? item.$index : item) === keys[0]);
        if (keys.length <= 1) {
            return Object.values(item).length !== 1;
        }
        const sub = Object.values(item).find(value => (value instanceof Object ? value.$index : value) === keys[1]);
        if (keys.length === 2) {
            return sub instanceof Object ? Object.values(sub).length !== 1 : true;
        }
        if (keys.length === 3 && sub instanceof Object) {
            return Object.values(sub).includes(keys[2]);
        }
    }
};
PermissionManagerService = PermissionManagerService_1 = __decorate([
    singleton(),
    __param(1, createLogger(PermissionManagerService_1.name)),
    __metadata("design:paramtypes", [PermissionManagerRepository, Object])
], PermissionManagerService);
export { PermissionManagerService };
//# sourceMappingURL=permissionManager.service.js.map