import { Repository } from "../repository.js";
import { BuffManagerSettings } from "../../entities/buffManager/index.js";
import { DatabaseService } from "../../config/databaseService.js";
export declare class BuffManagerSettingsRepository extends Repository<BuffManagerSettings> {
    constructor(db: DatabaseService);
    getActiveSettings(): Promise<BuffManagerSettings[]>;
}
//# sourceMappingURL=buffManagerSettingsRepository.d.ts.map