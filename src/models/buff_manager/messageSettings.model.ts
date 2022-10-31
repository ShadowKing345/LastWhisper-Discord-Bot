/**
 * Settings for posting the daily messages.
 */
export class MessageSettings {
    public channelId: string = null;
    public hour: string = null;
    public dow: number | null = null;
    public buffMessage: string = null;
    public weekMessage: string = null;
}