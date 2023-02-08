import { DatabaseService } from "../config/databaseService.js";
import { ManagerUtilsConfig } from "../entities/managerUtils.js";
import { SelfCreatingRepository } from "./base/selfCreatingRepository.js";
export declare class ManagerUtilsRepository extends SelfCreatingRepository<ManagerUtilsConfig> {
    constructor(db: DatabaseService);
}
//# sourceMappingURL=managerUtils.d.ts.map