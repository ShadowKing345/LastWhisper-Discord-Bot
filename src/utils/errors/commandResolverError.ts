/**
 * Error thrown when the command resolver fails to find a command with the given name.
 */
export class CommandResolverError extends Error {
  constructor(message: string) {
    super(message);
  }
}
