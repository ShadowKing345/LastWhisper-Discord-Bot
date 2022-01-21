import mongoose from "mongoose";
import {RoleManagerConfig} from "../objects/RoleManager";

const schema = new mongoose.Schema<RoleManagerConfig>({
    _id: String,
    newUserRoleId: String,
    memberRoleId: String,
    reactionMessageIds: Array,
    reactionListeningChannel: String
});

export default mongoose.model<RoleManagerConfig>("RoleManager", schema);