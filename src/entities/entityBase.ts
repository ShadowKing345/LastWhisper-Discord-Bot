import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

export class EntityBase extends BaseEntity {
    @PrimaryGeneratedColumn( "uuid" )
    public id: string;

    @Column( { nullable: false } )
    public guildId: string = null;
}
