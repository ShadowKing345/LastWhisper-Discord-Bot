import { DatabaseService } from "../config/databaseService.js";
import { RoleManagerConfig } from "../entities/roleManager.js";
import { repository } from "../decorators/index.js";
import { SelfCreatingRepository } from "./base/selfCreatingRepository.js";

/**
 * Repository for RoleManagerConfig
 * @see RoleManagerConfig
 */
@repository()
export class RoleManagerRepository extends SelfCreatingRepository<RoleManagerConfig> {
    constructor( db: DatabaseService ) {
        super( db, RoleManagerConfig );
    }
}
