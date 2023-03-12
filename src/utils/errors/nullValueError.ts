/**
 * Error throw when a value is null that should not be.
 */
export class NullValueError extends Error implements Error {
    constructor( message: string ) {
        super( message );
    }
}