import { DatabaseService } from "../../config/databaseService.js";
import { Repository } from "../repository.js";
import { EventManagerSettings } from "../../entities/eventManager/index.js";
export declare class EventManagerSettingsRepository extends Repository<EventManagerSettings> {
    constructor(db: DatabaseService);
    getConfig(guildId: string): Promise<EventManagerSettings>;
}
//# sourceMappingURL=eventManagerSettingsRepository.d.ts.map