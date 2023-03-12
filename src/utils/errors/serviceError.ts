/**
 * Error thrown when a service error occurs.
 */
export class ServiceError extends Error {
    constructor( message: string ) {
        super( message );
    }
}
