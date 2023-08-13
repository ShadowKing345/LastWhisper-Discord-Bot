export interface Mergeable<T> {
    merge( obj: Partial<T> ): T;
}