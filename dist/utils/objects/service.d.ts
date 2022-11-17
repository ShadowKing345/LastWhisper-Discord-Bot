import { RepositoryBase, IEntity } from "./repositoryBase.js";
import { MergeObjectBase } from "./mergeObjectBase.js";
export declare abstract class Service<T extends MergeObjectBase<T> & IEntity<unknown>> {
    protected repository: RepositoryBase<T>;
    protected constructor(repository: RepositoryBase<T>);
    protected getConfig(id: string): Promise<T>;
}
//# sourceMappingURL=service.d.ts.map