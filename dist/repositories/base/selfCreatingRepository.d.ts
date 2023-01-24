import { EntityTarget } from "typeorm";
import { DatabaseService } from "../../config/index.js";
import { EntityBase } from "../../entities/entityBase.js";
import { Repository } from "./repository.js";
export declare abstract class SelfCreatingRepository<T extends EntityBase> extends Repository<T> {
    protected constructor(db: DatabaseService, entity: EntityTarget<T>);
    findOneOrCreateByGuildId(guildId: string): Promise<T>;
}
//# sourceMappingURL=selfCreatingRepository.d.ts.map