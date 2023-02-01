import { PermissionManagerService } from "../services/permissionManager.js";
import { ChatInputCommandInteraction } from "discord.js";
import { Logger } from "../config/index.js";

/**
 * Base class for a module.
 */
export abstract class Module {
  public readonly moduleName: string = "Module";

  protected constructor(
    protected logger: Logger,
    public permissionManagerService: PermissionManagerService,
  ) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async commandResolver(_: ChatInputCommandInteraction, _1 = true) {
    return Promise.resolve();
  }
}
