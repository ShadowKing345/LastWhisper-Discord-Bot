/**
 * Error thrown when an argument is not of the correct value or type.
 */
export class InvalidArgumentError extends Error {
    constructor( message: string ) {
        super( message );
    }
}
