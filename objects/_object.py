class CustomConfigObject(object):
    @classmethod
    def from_json(cls, data):
        obj = cls()
        obj.__dict__ = data
        return obj

    @staticmethod
    def converter(obj):
        return obj.__dict__

    def __getitem__(self, item):
        return self.__dict__[item]

    def __setitem__(self, key, value):
        self.__dict__[key] = value


def convert_dict_list(dictionary: dict, class_object: CustomConfigObject.__class__):
    copy: dict = dictionary.copy()
    dictionary.clear()

    for key, value in sorted(copy.items()):
        dictionary[key]: class_object = class_object.from_json(value)
