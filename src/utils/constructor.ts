declare type constructor<T> = {
    new( ...args: unknown[] ): T;
};
export default constructor;