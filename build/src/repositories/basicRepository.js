export class BasicRepository {
    collection;
    async save(config) {
        const result = await this.collection.findOneAndReplace({ _id: config._id }, config, { upsert: true });
        return result.ok ? this.sanitiseOutput(result.value) : null;
    }
    async findOne(filter) {
        // For some reason due to the void call Webstorm is having issues seeing this method call.
        // noinspection JSVoidFunctionReturnValueUsed
        return this.sanitiseOutput(await this.collection.findOne(filter));
    }
    async find(filter) {
        return (await this.collection.find(filter).toArray()).map(config => this.sanitiseOutput(config));
    }
    async bulkSave(configs) {
        if (configs.length <= 0)
            return;
        const bulk = this.collection.initializeOrderedBulkOp();
        configs.forEach(config => bulk.find({ _id: config._id }).upsert().replaceOne(config));
        await bulk.execute();
    }
}
//# sourceMappingURL=basicRepository.js.map