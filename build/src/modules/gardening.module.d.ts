import { ModuleBase } from "../classes/moduleBase.js";
import { GardeningManagerService } from "../services/gardeningManager.service.js";
export declare class GardeningModule extends ModuleBase {
    private service;
    constructor(service: GardeningManagerService);
    private register;
    private cancel;
    private list;
    private tick;
    private subCommandResolver;
}
//# sourceMappingURL=gardening.module.d.ts.map