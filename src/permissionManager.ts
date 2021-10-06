import { ApplicationCommandPermissionType, Guild } from "discord.js";
import Client from "./Client";

const configName = "permissions";

class Permission {
  id: string;
  type: ApplicationCommandPermissionType;
  permission: boolean;

  constructor(id: string = "", type: ApplicationCommandPermissionType = "ROLE", permission: boolean = false) {
    this.id = id;
    this.type = type;
    this.permission = permission;
  }
}

class Command {
  name: string;
  permissions: Permission[];

  constructor(name: string, permissions: Permission[] = []) {
    this.name = name;
    this.permissions = permissions;
  }
}

class DefaultConfigs {
  commands: Command[];

  constructor(commands: Command[] = []) {
    this.commands = commands;
  }
}

export default async function(client: Client) {
  //todo: figure out and finish.
}
