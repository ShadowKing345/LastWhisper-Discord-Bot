import { DatabaseService } from "../../config/index.js";
import { EventObject } from "../../entities/eventManager/index.js";
import { Repository } from "../base/repository.js";
export declare class EventObjectRepository extends Repository<EventObject> {
    constructor(db: DatabaseService);
    getEventsByGuildId(guildId: string): Promise<EventObject[]>;
}
//# sourceMappingURL=eventObjectRepository.d.ts.map