import { DatabaseService } from "../config/databaseService.js";
import { RoleManagerConfig } from "../entities/roleManager.js";
import { SelfCreatingRepository } from "./base/selfCreatingRepository.js";
export declare class RoleManagerRepository extends SelfCreatingRepository<RoleManagerConfig> {
    constructor(db: DatabaseService);
}
//# sourceMappingURL=roleManager.d.ts.map