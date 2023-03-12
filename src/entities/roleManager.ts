import { Entity, Column } from "typeorm";
import { EntityBase } from "./entityBase.js";

/**
 * Role manager configuration object.
 */
@Entity()
export class RoleManagerConfig extends EntityBase {
    @Column( { nullable: true } )
    public acceptedRoleId: string = null;

    @Column( "text", { array: true } )
    public reactionMessageIds: string[];

    @Column( { nullable: true } )
    public reactionListeningChannel: string = null;
}
