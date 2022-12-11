import { IOptional } from "./iOptional.js";
export declare class Optional<T> implements IOptional<T> {
    private readonly value;
    constructor(value?: T);
    getValue(): T;
    hasValue(): boolean;
    map<G>(mapper: (T: any) => G): IOptional<G>;
}
//# sourceMappingURL=optional.d.ts.map