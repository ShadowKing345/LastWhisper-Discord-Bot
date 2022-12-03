import { ServiceError } from "../utils/errors/index.js";
export class Service {
    repository;
    entity;
    constructor(repository, entity) {
        this.repository = repository;
        this.entity = entity;
    }
    async getConfig(guildId) {
        if (!guildId) {
            throw new ServiceError("Guild ID cannot be null.");
        }
        const result = await this.repository.findOne({ where: { guildId: guildId } });
        if (result)
            return result;
        const config = new this.entity();
        config.guildId = guildId;
        return this.repository.save(config);
    }
}
//# sourceMappingURL=service.js.map