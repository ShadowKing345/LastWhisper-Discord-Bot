interface RoleManagerConfig {
  _id: string;
  newUserRoleId: string;
  memberRoleId: string;
  reactionMessageIds: Array<string>;
  reactionListeningChannel: string;
}

export { RoleManagerConfig };
