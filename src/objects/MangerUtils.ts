import mongoose from "mongoose";

interface ManagerUtilConfig {
  _id: string;
  loggingChannel: string;
  clearChannelBlacklist: Array<string>;
}

const schema = new mongoose.Schema<ManagerUtilConfig>({
  _id: String,
  loggingChannel: String,
  clearChannelBlacklist:Array
});

const Model = mongoose.model<ManagerUtilConfig>("ManagerUtil", schema);

export default Model;
export { ManagerUtilConfig };
