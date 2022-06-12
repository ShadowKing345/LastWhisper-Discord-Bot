import { ModuleBase } from "../shared/models/moduleBase.js";
import { GardeningManagerService } from "./gardeningManager.service.js";
export declare class GardeningManagerModule extends ModuleBase {
    private gardeningManagerService;
    constructor(gardeningManagerService: GardeningManagerService);
    private register;
    private cancel;
    private list;
    private tick;
    private subCommandResolver;
}
//# sourceMappingURL=gardeningManager.module.d.ts.map