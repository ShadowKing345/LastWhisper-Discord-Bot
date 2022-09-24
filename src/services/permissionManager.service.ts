import { CommandInteraction, Interaction, MessageEmbed, Role } from "discord.js";
import { pino } from "pino";
import { singleton } from "tsyringe";

import { createLogger } from "../utils/logger/logger.decorator.js";
import { deepMerge } from "../utils/index.js";
import { PermissionKeys } from "../permission_manager/addCommandKeys.decorator.js";
import { Permission, PermissionKeysType, PermissionManagerConfig, PermissionMode } from "../models/permission_manager/index.js";
import { PermissionManagerRepository } from "../repositories/permissionManager.repository.js";

@singleton()
export class PermissionManagerService {
    constructor(
        private permissionManagerRepository: PermissionManagerRepository,
        @createLogger(PermissionManagerService.name) private logger: pino.Logger,
    ) {
    }

    public async isAuthorized(interaction: Interaction, key: string): Promise<boolean> {
        this.logger.debug(`Attempting to authorize for key ${key}`);
        if (!PermissionManagerService.keyExists(key)) {
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

        const config: PermissionManagerConfig = await this.findOneOrCreate(interaction.guildId);
        const permission: Permission = deepMerge(new Permission(), config.permissions[key] ?? new Permission());

        let result;
        if (permission.roles.length === 0) {
            this.logger.debug(`Length is 0. Flag set to true.`);
            result = true;
        } else {
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

    public async addRole(interaction: CommandInteraction, key: string, role: Role): Promise<void> {
        if (!PermissionManagerService.keyExists(key)) {
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

    public async removeRole(interaction: CommandInteraction, key: string, role: Role): Promise<void> {
        if (!PermissionManagerService.keyExists(key)) {
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

    public async config(interaction: CommandInteraction, key: string): Promise<void> {
        if (!PermissionManagerService.keyExists(key)) {
            return interaction.reply({
                content: "Cannot find key. Please input the correct key.",
                ephemeral: true,
            });
        }

        const config = await this.findOneOrCreate(interaction.guildId);
        const permission = config.permissions[key] ??= new Permission();

        const mode: number = interaction.options.getInteger("mode", false);

        if (mode != null) {
            permission.mode = mode;
        }
        const black_list: boolean = interaction.options.getBoolean("black_list");
        if (black_list != null) {
            permission.blackList = black_list;
        }

        await this.permissionManagerRepository.save(config);
        return interaction.reply({
            content: "Config set.",
            ephemeral: true,
        })
    }

    public async reset(interaction: CommandInteraction, key: string): Promise<void> {
        if (!PermissionManagerService.keyExists(key)) {
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

    public async listPermissions(interaction: CommandInteraction, key?: string): Promise<void> {
        if (key) {
            if (!PermissionManagerService.keyExists(key)) {
                return interaction.reply({
                    content: "Cannot find key. Please input the correct key.",
                    ephemeral: true,
                });
            }

            const config = await this.findOneOrCreate(interaction.guildId);
            const permission = config.permissions[key] ?? new Permission();

            return interaction.reply({
                embeds: [ new MessageEmbed({
                    title: `Settings for Permission ${key}`,
                    description: `\`\`\`\nMode:\t\t${PermissionMode[permission.mode]},\nBlacklist:   ${permission.blackList},\nRoles:\t   [ ${permission.roles.join(", ")} ]\n\`\`\``,
                    color: "RANDOM",
                }) ],
                ephemeral: true,
            });
        } else {
            const result = `\`\`\`\n${
                PermissionKeys
                    .map((key) => key instanceof Object ? `${key.$index} {\n\t${
                        Object.entries(key)
                            .filter(([ k ]) => k !== "$index")
                            .map(([ , v ]) => v instanceof Object ?
                                `${v.$index} {\n\t\t${
                                    Object.entries(v)
                                        .filter(([ k ]) => k !== "$index")
                                        .map(([ , v ]) => v)
                                        .join(",\n\t\t")
                                }\n\t}`
                                : v)
                            .join(",\n\t")
                    }\n}` : key)
                    .join(",\n")
            }\n\`\`\``;
            return interaction.reply({
                embeds: [ new MessageEmbed({
                    title: "List of PermissionKeys",
                    description: result,
                    color: "RANDOM",
                }) ],
                ephemeral: true,
            });
        }
    }

    private async findOneOrCreate(id: string): Promise<PermissionManagerConfig> {
        let result = await this.permissionManagerRepository.findOne({ guildId: id });
        if (result) return result;

        result = new PermissionManagerConfig();
        result.guildId = id;

        return await this.permissionManagerRepository.save(result);
    }

    public static addPermissionKeys(keys: PermissionKeysType): void {
        PermissionKeys.push(keys);
    }

    public static removePermissionKey(prefix: string): void {
        PermissionKeys.splice(PermissionKeys.findIndex(key => (key instanceof Object ? key.$index : key) === prefix), 1);
    }

    private static keyExists(key: string): boolean {
        const keys: string[] = key.split(".");

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
}