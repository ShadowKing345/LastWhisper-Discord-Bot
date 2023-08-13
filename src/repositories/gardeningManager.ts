import { DatabaseService } from "../configurations/index.js";
import { GardeningModuleConfig } from "../entities/gardeningManager/index.js";
import { repository } from "../decorators/index.js";
import { Repository } from "./base/repository.js";

/**
 * Repository for GardeningModuleConfig
 * @see GardeningModuleConfig
 */
@repository()
export class GardeningManagerRepository extends Repository<GardeningModuleConfig> {
    constructor( db: DatabaseService ) {
        super( db, GardeningModuleConfig );
    }
}
