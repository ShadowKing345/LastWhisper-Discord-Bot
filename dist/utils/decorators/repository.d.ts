import { constructor } from "tsyringe/dist/typings/types/index.js";
import { Repository } from "../../repositories/repository.js";
import { EntityBase } from "../../entities/entityBase.js";
export declare function repository<T extends Repository<G>, G extends EntityBase>(): (target: constructor<T>) => void;
//# sourceMappingURL=repository.d.ts.map