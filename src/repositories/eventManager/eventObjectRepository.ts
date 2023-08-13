import { Raw } from "typeorm";
import { DatabaseService } from "../../configurations/index.js";
import { EventObject } from "../../entities/eventManager/index.js";
import { repository } from "../../decorators/index.js";
import { Repository } from "../base/repository.js";

/**
 * Repository for EventManagerConfig
 * @see EventObject
 */
@repository()
export class EventObjectRepository extends Repository<EventObject> {
    constructor( db: DatabaseService ) {
        super( db, EventObject );
    }

    public async getEventsByGuildId( guildId: string ): Promise<EventObject[]> {
        return this.findAll( { where: { guildId } } );
    }

    public async getTheDaysEvents( guildId: string, now: number ): Promise<EventObject[]> {
        return this.findAll( { where: { guildId, dateTime: Raw((date) => `(${date} - ${now}) < 86400`) } } );
    }
}