import { Guild } from "discord.js";
import { BaseEntity } from "typeorm";

/**
 * Representation of a permission.
 */
export class Permission extends BaseEntity {
  public roles: string[] = [];
  public mode: PermissionMode = PermissionMode.ANY;
  public blackList?: boolean = false;

  /**
   * Returns the enum name of the current enum.
   */
  public get modeEnum(): string {
    return PermissionMode[this.mode];
  }

  /**
   * Returns an array of promises fetching the name of each role.
   * @param guild The guild to fetch the role names from.
   */
  public fetchRoleNames(guild: Guild): Promise<string>[] {
    return this.roles.map(roleId => guild?.roles.fetch(roleId).then(role => role?.name));
  }

  /**
   * Formats all the roles into an enum friendly format.
   * @param guild The guild to fetch the role names from.
   */
  public async formatRoles(guild: Guild): Promise<string> {
    return this.roles.length > 0
      ? (await Promise.allSettled(this.fetchRoleNames(guild))).join("\n")
      : "No roles were set.";
  }

  public merge(obj: Partial<Permission>): Permission {
    if (obj.blackList) {
      this.blackList = obj.blackList;
    }

    if (obj.mode) {
      this.mode = obj.mode;
    }

    if (obj.roles) {
      this.roles = obj.roles;
    }

    return this;
  }
}

// Modes for how permissions are handled.
export enum PermissionMode {
  ANY,
  STRICT,
}
