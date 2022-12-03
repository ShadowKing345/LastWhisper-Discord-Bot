import { Repository } from "../repositories/repository.js";
import { GuildConfigBase } from "../entities/guildConfigBase.js";
export declare abstract class Service<T extends GuildConfigBase> {
    protected repository: Repository<T>;
    private entity;
    protected constructor(repository: Repository<T>, entity: {
        new (): T;
    });
    protected getConfig(guildId: string): Promise<T>;
}
//# sourceMappingURL=service.d.ts.map