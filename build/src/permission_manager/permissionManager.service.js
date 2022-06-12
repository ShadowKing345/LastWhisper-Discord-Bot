var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PermissionManagerService_1;
import chalk from "chalk";
import { MessageEmbed } from "discord.js";
import { injectable } from "tsyringe";
import { buildLogger } from "../shared/logger.js";
import { deepMerge } from "../shared/utils.js";
import { PermissionManagerKeys } from "./addCommandKeys.js";
import { Permission, PermissionManagerConfig, PermissionMode } from "./models/index.js";
import { PermissionManagerRepository } from "./permissionManager.repository.js";
let PermissionManagerService = PermissionManagerService_1 = class PermissionManagerService {
    permissionManagerRepository;
    logger = buildLogger(PermissionManagerService_1.name);
    constructor(permissionManagerRepository) {
        this.permissionManagerRepository = permissionManagerRepository;
    }
    async isAuthorized(interaction, key) {
        this.logger.debug(`Attempting to authorize for key ${key}`);
        if (!PermissionManagerService_1.keyExists(key)) {
            this.logger.debug(`${chalk.red("Expected Failure:")} Could not find key.`);
            return false;
        }
        if (!interaction) {
            this.logger.debug(`${chalk.red("Expected Failure:")} Interaction is null.`);
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
        return result && !permission.blackList;
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
        console.log(interaction);
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
            const result = `\`\`\`\n${PermissionManagerKeys
                .map((key) => `${key.$index} {\n\t${Object.entries(key)
                .filter(([k]) => k !== "$index")
                .map(([, v]) => v instanceof Object ?
                `${v.$index} {\n\t\t${Object.entries(v)
                    .filter(([k]) => k !== "$index")
                    .map(([, v]) => v)
                    .join(",\n\t\t")}\n\t}`
                : v)
                .join(",\n\t")}\n}`)
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
        PermissionManagerKeys.push(keys);
    }
    static removePermissionKey(prefix) {
        PermissionManagerKeys.splice(PermissionManagerKeys.findIndex(key => key.$index === prefix), 1);
    }
    static keyExists(key) {
        const split = key.split(".");
        const prefix = PermissionManagerKeys.find(k => k.$index === split[0]);
        if (!prefix) {
            return false;
        }
        if (split.length === 2) {
            return Object.values(prefix).includes(split[1]);
        }
        if (split.length === 3) {
            for (const v of Object.values(prefix)) {
                if (!(v instanceof Object)) {
                    continue;
                }
                if (v.$index === split[1]) {
                    return Object.values(v).includes(split[2]);
                }
            }
        }
        return false;
    }
};
PermissionManagerService = PermissionManagerService_1 = __decorate([
    injectable(),
    __metadata("design:paramtypes", [PermissionManagerRepository])
], PermissionManagerService);
export { PermissionManagerService };
//# sourceMappingURL=permissionManager.service.js.map