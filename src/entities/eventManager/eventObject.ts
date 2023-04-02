/**
 * Event object.
 */
import {DateTime} from "luxon";
import {Entity, Column} from "typeorm";
import {EntityBase} from "../entityBase.js";
import {isStringNullOrEmpty} from "../../utils/index.js";

@Entity()
export class EventObject extends EntityBase {

    @Column({nullable: true})
    public messageId: string = null;

    @Column()
    public name: string = null;

    @Column()
    public description: string = null;

    @Column()
    public dateTime: number = null;

    @Column("text", {array: true})
    public additional: [string, string][] = [];

    constructor(data: Partial<EventObject> = null) {
        super();
        
        if (data){
            this.merge(data);
        }
    }

    /**
     * Checks if teh event is valid.
     */
    public get isValid(): boolean {
        return (
            !isStringNullOrEmpty(this.name) &&
            !isStringNullOrEmpty(this.description) &&
            this.dateTime > DateTime.now().toUnixInteger()
        );
    }

    public merge(obj: Partial<EventObject>): EventObject {
        if (obj.messageId) {
            this.messageId = obj.messageId;
        }

        if (obj.name) {
            this.name = obj.name;
        }

        if (obj.description) {
            this.description = obj.description;
        }

        if (obj.dateTime) {
            this.dateTime = obj.dateTime;
        }

        if (obj.additional) {
            this.additional = obj.additional;
        }

        return this;
    }
}
