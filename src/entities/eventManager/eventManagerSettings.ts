import {Entity, Column} from "typeorm";
import {EntityBase} from "../entityBase.js";
import {isArray, isStringNullOrEmpty} from "../../utils/index.js";

/**
 * Event manager configuration object.
 */
@Entity()
export class EventManagerSettings extends EntityBase {

    @Column({nullable: true})
    public listenerChannelId: string = null;

    @Column({nullable: true})
    public postingChannelId: string = null;

    @Column("character", {array: true})
    public delimiterCharacters: [string, string] = ["[", "]"];

    @Column({nullable: true})
    public announcement: string = null;

    @Column({nullable: true})
    public description: string = null;

    @Column({nullable: true})
    public dateTime: string = null;

    @Column("text", {array: true})
    public exclusionList: string[] = [];

    @Column("text", {array: true})
    public dateTimeFormat: string[] = [];

    constructor(
        data: Partial<EventManagerSettings> = {
            guildId: null,
            announcement: "Event Announcement",
            description: "Event Description",
            dateTime: "Time",
        }
    ) {
        super();

        if (data) {
            this.merge(data);
        }
    }

    public merge(obj: Partial<EventManagerSettings>): EventManagerSettings {
        super.merge(obj);
 
        if (!isStringNullOrEmpty(obj.announcement)){
            this.announcement = obj.announcement;
        }
 
        if (!isStringNullOrEmpty(obj.description)){
            this.description = obj.description;
        }
 
        if (!isStringNullOrEmpty(obj.dateTime)){
            this.dateTime = obj.dateTime;
        }
 
        if (!isStringNullOrEmpty(obj.listenerChannelId)){
            this.listenerChannelId = obj.listenerChannelId;
        }
 
        if (!isStringNullOrEmpty(obj.postingChannelId)){
            this.postingChannelId = obj.postingChannelId;
        }
        
        if (isArray(obj.delimiterCharacters)){
            const hold = obj.delimiterCharacters.filter(item => typeof item === "string" && !isStringNullOrEmpty(item));
            if (hold.length !== 2){
                throw new Error("Merging Error: Delimiter character array must be of length 2");
            }
            
            this.delimiterCharacters = hold as [string, string];
        }
        
        if (isArray(obj.exclusionList)){
            this.exclusionList = obj.exclusionList.filter(item => typeof item === "string" && !isStringNullOrEmpty(item));
        }
        
        if (isArray(obj.dateTimeFormat)){
            this.dateTimeFormat = obj.dateTimeFormat.filter(item => typeof item === "string" && !isStringNullOrEmpty(item));
        }
    
        return this;
    }
}
