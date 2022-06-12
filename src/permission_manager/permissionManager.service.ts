import chalk from "chalk";
import { CommandInteraction, Interaction, MessageEmbed, Role } from "discord.js";
import { injectable } from "tsyringe";

import { buildLogger } from "../shared/logger.js";
import { deepMerge } from "../shared/utils.js";
import { PermissionManagerKeys } from "./addCommandKeys.js";
import { Permission, PermissionKeys, PermissionManagerConfig, PermissionMode } from "./models/index.js";
import { PermissionManagerRepository } from "./permissionManager.repository.js";

@injectable()
export class PermissionManagerService {
    private readonly logger = buildLogger(PermissionManagerService.name);

    constructor(private permissionManagerRepository: PermissionManagerRepository) {}

    public async isAuthorized(interaction: Interaction, key: string): Promise<boolean> {
        this.logger.debug(`Attempting to authorize for key ${key}`);
        if (!PermissionManagerService.keyExists(key)) {
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
        return result && !permission.blackList;
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
        console.log(interaction);
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
                PermissionManagerKeys
                    .map((key) => `${key.$index} {\n\t${
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
                    }\n}`)
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

    public static addPermissionKeys(keys: PermissionKeys): void {
        PermissionManagerKeys.push(keys);
    }

    public static removePermissionKey(prefix: string): void {
        PermissionManagerKeys.splice(PermissionManagerKeys.findIndex(key => key.$index === prefix), 1);
    }

    private static keyExists(key: string): boolean {
        const split: string[] = key.split(".");

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
}