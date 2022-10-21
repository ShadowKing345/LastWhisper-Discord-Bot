import { EmbedBuilder, Role, InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { singleton } from "tsyringe";

import { createLogger } from "../utils/loggerService.js";
import { Permission, PermissionManagerConfig, PermissionMode } from "../models/permission_manager/index.js";
import { PermissionManagerRepository } from "../repositories/permissionManager.repository.js";

export const PermissionKeys: any = [];

/**
 * Service that manages the permissions of commands throughout the project.
 * The reason for this service is that while you are able to change certain permissions for regular slash commands, subcommands cannot have their permissions changed in the same way.
 */
@singleton()
export class PermissionManagerService {
    constructor(
        private permissionManagerRepository: PermissionManagerRepository,
        @createLogger(PermissionManagerService.name) private logger: pino.Logger,
    ) {
    }

    /**
     * Checks if a member is authorized to use the given key of a command.
     * @param interaction The interaction used to determine the rights.
     * @param key The name of the key to check against.
     */
    public async isAuthorized(interaction: ChatInputCommandInteraction, key: string): Promise<boolean> {
        this.logger.debug(`Attempting to authorize for key ${key}`);
        if (!PermissionManagerService.keyExists(key)) {
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

        const config: PermissionManagerConfig = await this.findOneOrCreate(interaction.guildId);
        // Todo: fix missing permissions.
        const permission: Permission = config.permissions[key] ?? new Permission();

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

        const authorized: boolean = (!permission.blackList && result) || (permission.blackList && !result);

        this.logger.debug(`User is ${authorized ? "Authenticated" : "Unauthenticated"}.`);
        return authorized;
    }

    /**
     * Adds a role to a permission.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission
     * @param role The role.
     */
    public async addRole(interaction: ChatInputCommandInteraction, key: string, role: Role): Promise<InteractionResponse> {
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

    /**
     * Removes a role from a permission.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission
     * @param role The role.
     */
    public async removeRole(interaction: ChatInputCommandInteraction, key: string, role: Role): Promise<InteractionResponse> {
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

    /**
     * Configures a permission.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission
     */
    public async config(interaction: ChatInputCommandInteraction, key: string): Promise<InteractionResponse> {
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
        });
    }

    /**
     * Resets all permission options and roles set.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission
     */
    public async reset(interaction: ChatInputCommandInteraction, key: string): Promise<InteractionResponse> {
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

    /**
     * List all permissions keys.
     * If key is set then it gives a detailed view of that permission settings.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission (optional)
     */
    public async listPermissions(interaction: ChatInputCommandInteraction, key?: string): Promise<InteractionResponse> {
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
                embeds: [ new EmbedBuilder({
                    title: `Settings for Permission ${key}`,
                    description: `\`\`\`\nMode:\t\t${PermissionMode[permission.mode]},\nBlacklist:   ${permission.blackList},\nRoles:\t   [ ${permission.roles.join(", ")} ]\n\`\`\``,
                }).setColor("Random") ],
                ephemeral: true,
            });
        } else {
            const result = `\`\`\`\n${
                PermissionKeys
                    .map((key) => key instanceof Object ? `${key.$index} {\n\t${
                        Object.entries(key)
                            .filter(([ k ]) => k !== "$index")
                            .map(([ , v ]) => v instanceof Object ?
                                `${(v as any).$index} {\n\t\t${
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
                embeds: [ new EmbedBuilder({
                    title: "List of PermissionKeys",
                    description: result,
                }).setColor("Random") ],
                ephemeral: true,
            });
        }
    }

    /**
     * Finds a config file or creates one.
     * @param id Id for the guild.
     * @private
     */
    private async findOneOrCreate(id: string): Promise<PermissionManagerConfig> {
        let result = await this.permissionManagerRepository.findOne({ guildId: id });
        if (result) return result;

        result = new PermissionManagerConfig();
        result.guildId = id;

        return await this.permissionManagerRepository.save(result);
    }

    /**
     * Removes a permission from the list of keys.
     * @param key The key to be removed.
     */
    public static removePermissionKey(key: string): void {
        PermissionKeys.splice(PermissionKeys.findIndex(key => (key instanceof Object ? key.$index : key) === key), 1);
    }

    /**
     * Checks to see if a key already exists.
     * @param key The key to check.
     * @private
     */
    private static keyExists(key: string): boolean {
        const keys: string[] = key.split(".");

        const item = PermissionKeys.find(item => (item instanceof Object ? item.$index : item) === keys[0]);
        if (keys.length <= 1) {
            return Object.values(item).length !== 1;
        }

        const sub = Object.values(item).find(value => ((value as any).$index ?? value) === keys[1]);
        if (keys.length === 2) {
            return sub instanceof Object ? Object.values(sub).length !== 1 : true;
        }

        if (keys.length === 3 && sub instanceof Object) {
            return Object.values(sub).includes(keys[2]);
        }
    }
}