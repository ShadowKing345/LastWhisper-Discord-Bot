import { BuffManagerModule } from "../buff_manager/index.js";
import { EventManagerModule } from "../event_manager/index.js";
import { GardeningManagerModule } from "../gardening_manager/index.js";
import { ManagerUtilsModule } from "../manager_utils/index.js";
import { PermissionManagerModule } from "../permission_manager/index.js";
import { RoleManagerModule } from "../role_manager/index.js";
import { ConfigurationClass } from "../shared/configuration.class.js";
import { LoggerFactory } from "../shared/logger.js";
import { Client } from "../shared/models/client.js";
import { ModuleBase } from "../shared/models/moduleBase.js";
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