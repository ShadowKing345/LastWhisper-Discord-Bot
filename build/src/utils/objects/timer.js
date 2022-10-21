/**
 * A representation of a timer for a module.
 */
export class Timer {
    name;
    timeout;
    execute;
    /**
     * Function that waits till the client is ready then simply exits.
     * This is meant to be a more standard way to do this wait for syntax.
     * @param client The client application.
     * @param checkAgainTime How long to wait before checking again. (Default 500ms).
     */
    static async waitTillReady(client, checkAgainTime = 500) {
        while (!client.isReady()) {
            await new Promise(resolve => setTimeout(resolve, checkAgainTime));
        }
    }
}
//# sourceMappingURL=timer.js.map