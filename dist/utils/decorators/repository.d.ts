import { constructor } from "tsyringe/dist/typings/types/index.js";
import { Repository } from "../../repositories/repository.js";
export declare function repository<T extends Repository<any>>(): (target: constructor<T>) => void;
//# sourceMappingURL=repository.d.ts.map