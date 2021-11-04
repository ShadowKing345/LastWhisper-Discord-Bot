import mongoose from "mongoose";

interface RoleManagerConfig {
  _id: string;
  newUserRoleId: string;
  memberRoleId: string;
  reactionMessageIds: Array<string>;
  reactionListeningChannel: string;
}

const schema = new mongoose.Schema<RoleManagerConfig>({
  _id: String,
  newUserRoleId: String,
  memberRoleId: String,
  reactionMessageIds: Array,
  reactionListeningChannel: String
});

const Model = mongoose.model<RoleManagerConfig>("RoleManager", schema);

export default Model;
export { RoleManagerConfig };
