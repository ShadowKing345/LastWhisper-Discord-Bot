export class RepositoryBase {
    async save(config) {
        const result = await this.collection.findOneAndReplace({ _id: config._id }, config, { upsert: true });
        return result.ok ? this.sanitiseOutput(result.value) : null;
    }
    async findOne(filter) {
        // For some reason due to the void call Webstorm is having issues seeing this method call.
        // noinspection JSVoidFunctionReturnValueUsed
        const result = await this.collection.findOne(filter);
        if (!result) {
            return null;
        }
        return this.sanitiseOutput(result);
    }
    async find(filter) {
        return (await this.collection.find(filter).toArray()).map(config => this.sanitiseOutput(config));
    }
    getAll() {
        return this.find({});
    }
    async bulkSave(configs) {
        if (configs.length <= 0)
            return;
        const bulk = this.collection.initializeOrderedBulkOp();
        configs.forEach(config => bulk.find({ _id: config._id }).upsert().replaceOne(config));
        await bulk.execute();
    }
}
//# sourceMappingURL=repositoryBase.js.map