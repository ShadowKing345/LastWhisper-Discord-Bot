import { Repository } from "./repository.js";
export class SelfCreatingRepository extends Repository {
    constructor(db, entity) {
        super(db, entity);
    }
    async findOneOrCreateByGuildId(guildId) {
        return await this.repo.findOne({ where: { guildId } })
            .then(result => !result
            ? this.repo.save({ guildId })
            : Promise.resolve(result));
    }
}
//# sourceMappingURL=selfCreatingRepository.js.map