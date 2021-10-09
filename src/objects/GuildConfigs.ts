import mongoose from "mongoose";
const {Schema} = mongoose;

interface GuildConfig {
  guildId: string;
  prefix: string;
}

const schema = new Schema<GuildConfig>(
  {
    guildId: {
      type: String,
      unique: true,
      required: true
    },
    prefix: {
        type: String,
        required: true
    }
  });

const Model = mongoose.model<GuildConfig>("guildConfig", schema);

export default Model;
export { GuildConfig };
