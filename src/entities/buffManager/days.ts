import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { Buff } from "./buff.js";
import { EntityBase } from "../entityBase.js";
import { WeekDays } from "./weekDays.js";

/**
 * Representation of one week's worth of buffs.
 */
@Entity()
export class Days extends EntityBase {

    @ManyToOne( () => Buff )
    @JoinColumn( { name: "monday_id" } )
    public monday: Promise<Buff>;

    @ManyToOne( () => Buff )
    @JoinColumn( { name: "tuesday_id" } )
    public tuesday: Promise<Buff>;

    @ManyToOne( () => Buff )
    @JoinColumn( { name: "wednesday_id" } )
    public wednesday: Promise<Buff>;

    @ManyToOne( () => Buff )
    @JoinColumn( { name: "thursday_id" } )
    public thursday: Promise<Buff>;

    @ManyToOne( () => Buff )
    @JoinColumn( { name: "friday_id" } )
    public friday: Promise<Buff>;

    @ManyToOne( () => Buff )
    @JoinColumn( { name: "saturday_id" } )
    public saturday: Promise<Buff>;

    @ManyToOne( () => Buff )
    @JoinColumn( { name: "sunday_id" } )
    public sunday: Promise<Buff>;

    private current = 0;

    private get array() {
        return [ this.monday, this.tuesday, this.wednesday, this.thursday, this.friday, this.saturday, this.sunday ];
    }

    [Symbol.iterator]() {
        this.current = 0;
        return this;
    }

    next() {
        if( this.current < 7 ) {
            return { done: false, value: this.array[this.current++] };
        }

        return { done: true, value: null };
    }

    public get toArray(): [ WeekDays, Promise<Buff> ][] {
        return [
            [ "Monday", this.monday ],
            [ "Tuesday", this.tuesday ],
            [ "Wednesday", this.wednesday ],
            [ "Thursday", this.thursday ],
            [ "Friday", this.friday ],
            [ "Saturday", this.saturday ],
            [ "Sunday", this.sunday ],
        ];
    }
}
