import { DatabaseService } from "../../config/index.js";
import { EventManagerSettings } from "../../entities/eventManager/index.js";
import { SelfCreatingRepository } from "../base/selfCreatingRepository.js";
export declare class EventManagerSettingsRepository extends SelfCreatingRepository<EventManagerSettings> {
    constructor(db: DatabaseService);
}
//# sourceMappingURL=eventManagerSettingsRepository.d.ts.map