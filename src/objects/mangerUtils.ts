class DefaultConfigs {
  loggingChannel: string;
  clearChannelBlacklist: string[];

  constructor(loggingChannel: string = "", clearChannelBlacklist: string[] = []) {
    this.loggingChannel = loggingChannel;
    this.clearChannelBlacklist = clearChannelBlacklist;
  }
}

export { DefaultConfigs };
