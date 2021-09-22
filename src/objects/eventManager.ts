class ReminderTrigger {
  message: string;
  timeDelta: string;

  constructor(message: string, timeDelta: string) {
    this.message = message;
    this.timeDelta = timeDelta;
  }
}

class EventObj {
  messageId: string;
  name: string;
  description: string;
  dateTime: string;
  additional: { [key: string]: string };

  constructor(messageId: string, name: string = "", description: string = "", dateTime: string = "", additional: { [key: string]: string } = {}) {
    this.messageId = messageId;
    this.name = name;
    this.description = description;
    this.dateTime = dateTime;
    this.additional = additional;
  }

  isValid(): boolean {
    return this.name != "" && this.description != "" && this.dateTime != "";
  }
}

class Tags {
  announcement: string;
  description: string;
  dateTime: string;
  exclusionList: string[];

  constructor(announcement: string = "Event Announcement", description: string = "Event Description", dateTime: string = "Time", exclusionList: string[] = []) {
    this.announcement = announcement;
    this.description = description;
    this.dateTime = dateTime;
    this.exclusionList = exclusionList;
  }
}

class DefaultConfig {
  listenerChannelId: string;
  postingChannelId: string;
  delimiterPattern: string;
  tags: Tags;
  dateTimeFormat: string[];
  events: EventObj[];
  reminders: ReminderTrigger[];

  constructor(listenerChannelId: string = "", postingChannelId: string = "", delimiterPattern: string = "", tags: Tags = new Tags(), dateTimeFormat: string[] = [], events: EventObj[] = [], reminders: ReminderTrigger[] = []) {
    this.listenerChannelId = listenerChannelId;
    this.postingChannelId = postingChannelId;
    this.delimiterPattern = delimiterPattern;
    this.tags = tags;
    this.dateTimeFormat = dateTimeFormat;
    this.events = events;
    this.reminders = reminders;
  }
}

export { ReminderTrigger, EventObj, DefaultConfig, Tags };
