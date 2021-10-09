import { v4 as uuid } from "uuid";
import mongoose, {SchemaDefinitionProperty} from "mongoose";

class Day {
  id: string;
  text: string;
  imageUrl: string;

  constructor(text: string, imageUrl: string) {
    this.id = uuid();
    this.text = text;
    this.imageUrl = imageUrl;
  }
}

class Week {
  title: string;
  days: Array<string>;

  constructor(title: string, monday: string, tuesday: string, wednesday: string, thursday: string, friday: string, saturday: string, sunday: string) {
    this.title = title;
    this.days = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
  }
}

class MessageSettings {
  channelId: string;
  hour: string;
  dow: number | null;
  buffMessage: string;
  weekMessage: string;

  constructor(channelId: string = "", hour: string = "", dow: number | null = null, buffMessage: string = "Today's Buff Shall Be:", weekMessage: string = "This Week's Buffs Are:") {
    this.channelId = channelId;
    this.hour = hour;
    this.dow = dow;
    this.buffMessage = buffMessage;
    this.weekMessage = weekMessage;
  }
}

interface BuffManagerConfig {
  guildId: string,
  messageSettings: SchemaDefinitionProperty<MessageSettings> | undefined;
  days: [Day];
  weeks: [Week];
}

const schema = new mongoose.Schema<BuffManagerConfig>({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  messageSettings: {
    type: Object,
    default: new MessageSettings
  },
  days: Array,
  weeks: Array
});

const Model = mongoose.model<BuffManagerConfig>("BuffManager", schema);

export default Model;
export { BuffManagerConfig, Week, Day, MessageSettings };
