/**
 * Representation of a permission.
 */
import { Guild } from "discord.js";

export class Permission {
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
    return this.roles.map((roleId) => guild?.roles.fetch(roleId).then((role) => role?.name));
  }

  /**
   * Formats all the roles into an enum friendly format.
   * @param guild The guild to fetch the role names from.
   */
  public async formatRoles(guild: Guild): Promise<string>{
    return this.roles.length > 0 ? (await Promise.allSettled(this.fetchRoleNames(guild))).join("\n") : "No roles were set."
  }
}

// Modes for how permissions are handled.
export enum PermissionMode {
  ANY,
  STRICT,
}
