import { DatabaseService } from "../../config/index.js";
import { BuffManagerSettings } from "../../entities/buffManager/index.js";
import { Repository } from "../base/repository.js";
export declare class BuffManagerSettingsRepository extends Repository<BuffManagerSettings> {
    constructor(db: DatabaseService);
    getActiveSettings(): Promise<BuffManagerSettings[]>;
}
//# sourceMappingURL=buffManagerSettingsRepository.d.ts.map