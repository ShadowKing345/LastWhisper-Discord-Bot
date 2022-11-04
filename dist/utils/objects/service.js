export class Service {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async findOneOrCreate(id) {
        if (!id) {
            throw new Error("Guild ID cannot be null.");
        }
        const result = await this.repository.findOne({ guildId: id });
        if (result)
            return result;
        return await this.repository.save({ guildId: id });
    }
}
//# sourceMappingURL=service.js.map