import {Collection, Filter} from "mongodb";
import {Database, DB} from "../config/databaseConfiguration.js";
import {ManagerUtilsConfig} from "../models/mangerUtils.model.js";
import {injectable} from "tsyringe";
import {BasicRepository} from "./basicRepository";

@injectable()
export class ManagerUtilsConfigRepository extends BasicRepository<ManagerUtilsConfig>{
    private readonly collectionName: string = "manager_utils";

    constructor(protected db: Database) {
        super();
        this.collection = db.collection(this.collectionName);
    }

    protected sanitiseOutput(config: ManagerUtilsConfig): ManagerUtilsConfig {
        return Object.assign(new ManagerUtilsConfig(), config);
    }
}
