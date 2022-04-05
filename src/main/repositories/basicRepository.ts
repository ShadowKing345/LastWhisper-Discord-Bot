import { Collection, Filter } from "mongodb";

export abstract class BasicRepository<T> {
    protected collection: Collection<T>;

    public async save(config: T): Promise<T> {
        const result = await this.collection.findOneAndReplace(config, { upsert: true });
        return this.sanitiseOutput(result);
    }

    public async findOne(filter: Filter<T>): Promise<T> {
        return this.sanitiseOutput(await this.collection.findOne(filter));
    }

    public async find(filter: Filter<T>): Promise<T[]> {
        return (await this.collection.find(filter).toArray()).map(config => this.sanitiseOutput(config));
    }

    public async bulkSave(configs: T[]) {
        if (configs.length <= 0) return;

        const bulk = this.collection.initializeOrderedBulkOp();
        configs.forEach(config => bulk.find({ _id: config._id }).upsert().replaceOne(config));

        await bulk.execute();
    }

    protected abstract sanitiseOutput(config: T): T;
}
