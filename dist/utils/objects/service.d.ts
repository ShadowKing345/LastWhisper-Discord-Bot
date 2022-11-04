import { RepositoryBase, IEntity } from "./repositoryBase.js";
import { MergeableObjectBase } from "./mergeableObjectBase.js";
export declare abstract class Service<T extends MergeableObjectBase<T> & IEntity<unknown>> {
    protected repository: RepositoryBase<T>;
    protected constructor(repository: RepositoryBase<T>);
    protected getConfig(id: string): Promise<T>;
}
//# sourceMappingURL=service.d.ts.map