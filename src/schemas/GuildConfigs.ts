import mongoose, { Schema } from "mongoose";

interface IGuildConfig extends mongoose.Document {
  guildId: string;
  configs: { [key: string]: {} };
}

const GuildConfigSchema: Schema = new Schema<IGuildConfig>(
  {
    guildId: {
      type: String,
      unique: true,
      required: true
    },
    configs: {
      type: Object,
    }
  });

const GuildConfig = mongoose.model<IGuildConfig>("guildConfig", GuildConfigSchema);

export { GuildConfigSchema, GuildConfig };
