/**
 * Error thrown by a decorator.
 */
export class DecoratorError extends Error {
    constructor( message: string ) {
        super( message );
    }
}
