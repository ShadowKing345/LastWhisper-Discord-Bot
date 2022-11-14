/**
 * Error to be thrown when an authorization key could not be found within the existing list of keys.
 */
export class BadAuthorizationKeyError extends Error {
  constructor(message: string) {
    super(message);
  }
}