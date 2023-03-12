import { Plot } from "./plot.js";
import { Entity, OneToMany, Column } from "typeorm";
import { EntityBase } from "../entityBase.js";

/**
 * Gardening module configuration object.
 */
@Entity()
export class GardeningModuleConfig extends EntityBase {
    @OneToMany( () => Plot, plot => plot.guildConfig, {
        cascade: true,
        orphanedRowAction: "delete",
        onDelete: "CASCADE",
    } )
    public plots: Plot[];

    @Column( { nullable: true } )
    public messagePostingChannelId: string = null;
}
