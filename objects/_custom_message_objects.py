from objects import CustomConfigObject, convert_dict_list
from datetime import datetime


class Message(CustomConfigObject):
    def __init__(self, message: str = None, channel_id: int = None, date: datetime = None, should_repeat: bool = False):
        self.message: str = message
        self.channel_id: int = channel_id
        self.date: datetime = date if date else datetime.now()
        self.should_repeat: bool = should_repeat

    @staticmethod
    def converter(obj):
        obj.date = obj.date.__str__()
        return obj.__dict__

    @classmethod
    def from_json(cls, data):
        obj = cls()
        obj.__dict__ = data

        obj.date = datetime.strptime(data["date"], "%Y-%m-%d %H:%M:%S")

        return obj


class CustomMessagesConfig(CustomConfigObject):
    def __init__(self, messages: {} = None):
        self.messages: {} = {} if messages is None else messages

    @classmethod
    def from_json(cls, data):
        obj = cls()
        obj.__dict__ = data

        convert_dict_list(obj.messages, Message)

        return obj
