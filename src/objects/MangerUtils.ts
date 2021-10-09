import mongoose from "mongoose";

interface ManagerUtilConfig {
  guildId: string;
  loggingChannel: string;
  clearChannelBlacklist: Array<string>;
}

const schema = new mongoose.Schema<ManagerUtilConfig>({
  guildId: {
    type: String,
    unique: true,
    true: true
  },
  loggingChannel: String,
  clearChannelBlacklist:Array
});

const Model = mongoose.model<ManagerUtilConfig>("ManagerUtil", schema);

export default Model;
export { ManagerUtilConfig };
