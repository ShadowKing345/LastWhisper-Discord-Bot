/**
 * Settings for posting the daily messages.
 */
export class MessageSettings {
    public channelId: string;
    public hour: string;
    public dow: number | null;
    public buffMessage: string;
    public weekMessage: string;
}