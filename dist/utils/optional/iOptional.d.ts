export interface IOptional<T> {
    hasValue(): boolean;
    getValue(): T;
    map<G>(mapper: (T: any) => G): IOptional<G>;
}
//# sourceMappingURL=iOptional.d.ts.map