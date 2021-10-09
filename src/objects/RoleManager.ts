import mongoose from "mongoose";

interface RoleManagerConfig {
  guildId: string;
  newUserRoleId: string;
  memberRoleId: string;
  reactionMessageIds: Array<string>;
  reactionListeningChannel: string;
}

const schema = new mongoose.Schema<RoleManagerConfig>({
  guildId: {
    type: String,
    unique: true,
    required: true
  },
  newUserRoleId: String,
  memberRoleId: String,
  reactionMessageIds: Array,
  reactionListeningChannel: String
});

const Model = mongoose.model<RoleManagerConfig>("RoleManager", schema);

export default Model;
export { RoleManagerConfig };
