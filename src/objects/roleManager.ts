class DefaultConfigs {
  newUserRoleId: string;
  memberRoleId: string;
  reactionMessageIds: string[];
  reactionListeningChannel: string;

  constructor(newUserRoleId: string = "", memberRoleId: string = "", reactionMessageIds: string[] = [], reactionListeningChannel: string = "") {
    this.newUserRoleId = newUserRoleId;
    this.memberRoleId = memberRoleId;
    this.reactionMessageIds = reactionMessageIds;
    this.reactionListeningChannel = reactionListeningChannel;
  }
}

export { DefaultConfigs };
