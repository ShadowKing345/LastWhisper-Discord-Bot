import { DatabaseService } from "../../configurations/index.js";
import { Days } from "../../entities/buffManager/index.js";
import { repository } from "../../decorators/index.js";
import { Repository } from "../base/repository.js";

@repository()
export class DaysRepository extends Repository<Days> {
    constructor( db: DatabaseService ) {
        super( db, Days );
    }
}