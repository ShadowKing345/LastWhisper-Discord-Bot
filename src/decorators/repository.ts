import { constructor } from "tsyringe/dist/typings/types/index.js";
import { injectable, container, Lifecycle } from "tsyringe";
import { Repository } from "../repositories/base/repository.js";
import { EntityBase } from "../entities/entityBase.js";

/**
 * Decorator that registers a repository base class as a singleton of its own type and of token ModuleBase.name.
 */
export function repository<T extends Repository<G>, G extends EntityBase>(): ( target: constructor<T> ) => void {
    return function( target: constructor<T> ) {
        injectable()( target );
        container.register<T>( target, target, { lifecycle: Lifecycle.ResolutionScoped } );
        container.register( Repository.name, { useClass: target } );
    };
}
