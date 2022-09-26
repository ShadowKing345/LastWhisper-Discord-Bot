import { PermissionManagerModule } from "../../permission_manager/index.js";
import { ConfigurationClass } from "../configuration.class.js";
import { LoggerFactory } from "../logger/logger.js";
import { Client } from "../models/client.js";
import { ModuleBase } from "../models/index.js";
import { BuffManagerModule } from "../../modules/buffManager.module.js";
import { EventManagerModule } from "../../modules/eventManager.module.js";
import { GardeningManagerModule } from "../../modules/gardeningManager.module.js";
import { ManagerUtilsModule } from "../../modules/managerUtils.module.js";
import { RoleManagerModule } from "../../modules/roleManager.module.js";
export declare class ModuleConfiguration extends ConfigurationClass {
    private readonly intervalIds;
    private readonly _modules;
    private readonly loggers;
    constructor(buffManagerModule: BuffManagerModule, eventManagerModule: EventManagerModule, gardeningManagerModule: GardeningManagerModule, managerUtilsModule: ManagerUtilsModule, roleManagerModule: RoleManagerModule, permissionManagerModule: PermissionManagerModule, loggerFactory: LoggerFactory);
    private interactionEvent;
    private runEvent;
    private runTask;
    configureModules(client: Client): void;
    cleanup(): void;
    get modules(): ModuleBase[];
}
//# sourceMappingURL=moduleConfiguration.d.ts.map