import json
import pathlib
import os

from objects import CustomConfigObject


def load_as_string(path):
    result = ""

    with open(path, "r") as f:
        for line in f:
            result += line

    return result


def save_as_json(path: str, obj: object):
    try:
        pathlib.Path(path[:path.rindex('/')]).mkdir(parents=True, exist_ok=True)

        with open(path, "w") as f:
            if isinstance(obj, CustomConfigObject):
                json.dump(obj.__dict__, f, indent=4, default=obj.converter)
            else:
                json.dump(obj, f, indent=4, default=lambda o: o.__dict__)
    except Exception as e:
        print(e)


def append_to_file(path: str, data: str):
    try:
        pathlib.Path(path[:path.rindex('/')]).mkdir(parents=True, exist_ok=True)

        with open(path, "a") as f:
            f.write(data)
    except Exception as e:
        print(e)


def remove_file(path: str):
    try:
        os.remove(path)
    except Exception as e:
        print(e)
