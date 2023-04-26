import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";
import {isStringNullOrEmpty} from "../utils/index.js";

export class EntityBase extends BaseEntity {
    @PrimaryGeneratedColumn( "uuid" )
    public id: string;

    @Column( { nullable: false } )
    public guildId: string = null;
    
    public merge(obj: Partial<EntityBase>): BaseEntity {
        if (!isStringNullOrEmpty(obj.id)){
            this.id = obj.id;
        }

        if (!isStringNullOrEmpty(obj.guildId)){
            this.guildId = obj.guildId;
        }
        
        return this;
    }
}
