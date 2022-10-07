import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { BuffManagerConfig } from "../models/buff_manager/index.js";
import { DatabaseError } from "../utils/errors/DatabaseError.js";

@singleton()
export class BuffManagerRepository extends RepositoryBase<BuffManagerConfig> {
    private readonly collectionName: string = "buff_manager";
    private _collection: Collection<BuffManagerConfig>;

    protected readonly sanitizedObject = BuffManagerConfig;

    constructor(private db: DatabaseConfigurationService) {
        super();
    }

    protected get collection(): Collection<BuffManagerConfig> {
        if (!this.db.isConnected) {
            throw new DatabaseError("Database was not connected to it source.");
        }

        return this._collection ??= this.db.db.collection<BuffManagerConfig>(this.collectionName);
    }
}
