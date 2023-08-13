import { DatabaseService } from "../../configurations/index.js";
import { Buff } from "../../entities/buffManager/index.js";
import { repository } from "../../decorators/index.js";
import { Repository } from "../base/repository.js";

@repository()
export class BuffRepository extends Repository<Buff> {
    constructor( db: DatabaseService ) {
        super( db, Buff );
    }
}