import { DatabaseService } from "../config/index.js";
import { PermissionManagerConfig } from "../entities/permissionManager/index.js";
import { repository } from "../decorators/index.js";
import { Repository } from "./base/repository.js";

/**
 * Repository for PermissionManagerConfig
 * @see PermissionManagerConfig
 */
@repository()
export class PermissionManagerRepository extends Repository<PermissionManagerConfig> {
    constructor( db: DatabaseService ) {
        super( db, PermissionManagerConfig );
    }
}
