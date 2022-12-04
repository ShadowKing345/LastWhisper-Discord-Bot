import { Repository } from "../repositories/repository.js";
import { EntityBase } from "../entities/entityBase.js";
export declare abstract class Service<T extends EntityBase> {
    protected repository: Repository<T>;
    private entity;
    protected constructor(repository: Repository<T>, entity: {
        new (): T;
    });
    protected getConfig(guildId: string): Promise<T>;
}
//# sourceMappingURL=service.d.ts.map