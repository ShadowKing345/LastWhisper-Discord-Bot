import { pino } from "pino";
import { BuffManagerModule } from "../buff_manager/index.js";
import { EventManagerModule } from "../event_manager/index.js";
import { GardeningManagerModule } from "../gardening_manager/index.js";
import { ManagerUtilsModule } from "../manager_utils/index.js";
import { PermissionManagerModule } from "../permission_manager/index.js";
import { RoleManagerModule } from "../role_manager/index.js";
import { ConfigurationClass } from "../shared/configuration.class.js";
import { Client } from "../shared/models/client.js";
import { Listener } from "../shared/models/listener.js";
import { ModuleBase } from "../shared/models/moduleBase.js";
export declare class ModuleConfiguration extends ConfigurationClass {
    private buffManagerModule;
    private eventManagerModule;
    private gardeningManagerModule;
    private managerUtilsModule;
    private roleManagerModule;
    private permissionManagerModule;
    private logger;
    private static readonly loggerMeta;
    constructor(buffManagerModule: BuffManagerModule, eventManagerModule: EventManagerModule, gardeningManagerModule: GardeningManagerModule, managerUtilsModule: ManagerUtilsModule, roleManagerModule: RoleManagerModule, permissionManagerModule: PermissionManagerModule, logger: pino.Logger);
    get modules(): ModuleBase[];
    runEvent(listeners: Listener[], client: Client, ...args: any[]): Promise<void>;
    configureModules(client: Client): void;
}
//# sourceMappingURL=moduleConfiguration.d.ts.map