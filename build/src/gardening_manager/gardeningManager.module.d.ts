import { ModuleBase } from "../utils/models/index.js";
import { GardeningManagerService } from "./gardeningManager.service.js";
export declare class GardeningManagerModule extends ModuleBase {
    private gardeningManagerService;
    private static readonly command;
    constructor(gardeningManagerService: GardeningManagerService);
    private register;
    private cancel;
    private list;
    private tick;
    private subCommandResolver;
}
//# sourceMappingURL=gardeningManager.module.d.ts.map