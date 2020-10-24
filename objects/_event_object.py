from objects import CustomConfigObject, convert_dict_list
from time import struct_time


class Event(CustomConfigObject):

    def __init__(self, name: str = None, description: str = "", datetime: struct_time = None):
        self.name: str = name
        self.description: str = description
        self.datetime: struct_time = datetime

    @classmethod
    def from_json(cls, data):
        obj = cls()
        obj.__dict__ = data

        obj.datetime = struct_time(obj.datetime)

        return obj


class EventConfig(CustomConfigObject):
    def __init__(self, channel_id: int = None, reminder_channel_id: int = None, name_tag: str = None, description_tag: str = None, datetime_tag: str = None, event_reminder_triggers: [int] = None, events: [Event] = None):
        self.channel_id: int = channel_id
        self.reminder_channel_id: int = reminder_channel_id

        self.name_tag: str = name_tag
        self.description_tag: str = description_tag
        self.datetime_tag: str = datetime_tag

        self.event_reminder_triggers: [int] = [] if not event_reminder_triggers else event_reminder_triggers
        self.events: [Event] = [] if not events else events

    @classmethod
    def from_json(cls, data):
        obj = cls()
        obj.__dict__ = data

        copy = obj.events.copy()
        obj.events.clear()
        for item in copy:
            obj.events.append(Event.from_json(item))

        return obj
