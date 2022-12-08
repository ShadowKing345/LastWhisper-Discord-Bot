import { Repository } from "../repository.js";
import { EventObject } from "../../entities/eventManager/index.js";
import { DatabaseService } from "../../config/databaseService.js";
export declare class EventObjectRepository extends Repository<EventObject> {
    constructor(db: DatabaseService);
    getEventsByGuildId(guildId: string): Promise<EventObject[]>;
}
//# sourceMappingURL=eventObjectRepository.d.ts.map