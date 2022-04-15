import { Collection, Filter } from "mongodb";

import { BasicModel } from "../models/basicModel.js";

export abstract class BasicRepository<T extends BasicModel> {
    protected collection: Collection<T>;

    public async save(config: T): Promise<T> {
        const result = await this.collection.findOneAndReplace({ _id: config._id }, config, { upsert: true });
        return result.ok ? this.sanitiseOutput(result.value as T) : null;
    }

    public async findOne(filter: Filter<T>): Promise<T> {
        // For some reason due to the void call Webstorm is having issues seeing this method call.
        // noinspection JSVoidFunctionReturnValueUsed
        return this.sanitiseOutput(await this.collection.findOne(filter) as T);
    }

    public async find(filter: Filter<T>): Promise<T[]> {
        return (await this.collection.find(filter).toArray()).map(config => this.sanitiseOutput(config as T));
    }

    public async bulkSave(configs: T[]) {
        if (configs.length <= 0) return;

        const bulk = this.collection.initializeOrderedBulkOp();
        configs.forEach(config => bulk.find({ _id: config._id }).upsert().replaceOne(config));

        await bulk.execute();
    }

    protected abstract sanitiseOutput(config: T): T;
}
