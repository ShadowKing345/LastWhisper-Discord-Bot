import { CommandInteraction, Interaction } from "discord.js";
import { injectable } from "tsyringe";

import { Permission, PermissionManagerConfig, PermissionMode } from "../models/permissionManagerConfig.model.js";
import { PermissionManagerRepository } from "../repositories/permissionManager.repository.js";
import { deepMerge } from "../utils/utils.js";

@injectable()
export class PermissionManagerService {
    constructor(private permissionManagerRepository: PermissionManagerRepository) {}

    public async isAuthorized(interaction: Interaction, key: string): Promise<boolean> {
        if (!(interaction && key)) {
            return false;
        }

        if (interaction.guild.ownerId === interaction.user.id) {
            return true;
        }

        const config: PermissionManagerConfig = await this.findOneOrCreate(interaction.guildId);
        const permission: Permission = deepMerge(new Permission(), config.permissions[key] ?? new Permission());

        let result;
        if (permission.roles.length === 0) {
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

        return result && !permission.blackList;
    }

    public async addRole(interaction: CommandInteraction): Promise<void> {
        const config = await this.findOneOrCreate(interaction.guildId);
        const role = interaction.options.getRole("role", true);
        const key = interaction.options.getString("key", true);

        const permissions = config.permissions[key] ??= new Permission();

        permissions.roles.push(role.id);
        await this.permissionManagerRepository.save(config);

        return interaction.reply({
            content: `Role added to key ${key}`,
            ephemeral: true,
        });
    }

    public async removeRole(interaction: CommandInteraction): Promise<void> {
        const config = await this.findOneOrCreate(interaction.guildId);
        const role = interaction.options.getRole("role", true);
        const key = interaction.options.getString("key", true);

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

    public async changeSettings(interaction: CommandInteraction): Promise<void> {
        console.log(interaction);
    }

    public async resetPermissions(interaction: CommandInteraction): Promise<void> {
        const config = await this.findOneOrCreate(interaction.guildId);
        const key = interaction.options.getString("key", true);

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

    public async listPermissions(interaction: CommandInteraction): Promise<void> {
        console.log(interaction);
    }

    private async findOneOrCreate(id: string): Promise<PermissionManagerConfig> {
        let result = await this.permissionManagerRepository.findOne({ guildId: id });
        if (result) return result;

        result = new PermissionManagerConfig();
        result.guildId = id;

        return await this.permissionManagerRepository.save(result);
    }
}