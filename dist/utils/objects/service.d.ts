import { Repository, IEntity } from "./repository.js";
import { MergeObjectBase } from "./mergeObjectBase.js";
export declare abstract class Service<T extends MergeObjectBase<T> & IEntity<unknown>> {
    protected repository: Repository<T>;
    protected constructor(repository: Repository<T>);
    protected getConfig(id: string): Promise<T>;
}
//# sourceMappingURL=service.d.ts.map