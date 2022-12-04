export abstract class Service {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any,@typescript-eslint/no-empty-function
  protected constructor(_any: any, _any2: any) {
  }

  /**
   * Attempts to find or create a new configuration file.
   * @param _guildId The Guild ID to look for. Throws if null was set.
   * @protected
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
  protected getConfig(_guildId: string): Promise<any> {
    return Promise.resolve();
  }
}
