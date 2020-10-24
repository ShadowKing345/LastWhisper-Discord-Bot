from objects import CustomConfigObject, convert_dict_list


class Buff(CustomConfigObject):

    def __init__(self, title: str = None, image_url: str = None):
        self.title = title
        self.image_url = image_url


class Week(CustomConfigObject):
    def __init__(self, name: str = "", monday: int = None, tuesday: int = None,
                 wednesday: int = None, thursday: int = None, friday: int = None, saturday: int = None,
                 sunday: int = None):

        self.name = name
        self.Monday = monday
        self.Tuesday = tuesday
        self.Wednesday = wednesday
        self.Thursday = thursday
        self.Friday = friday
        self.Saturday = saturday
        self.Sunday = sunday

    def get_value(self, index: int):
        try:
            return {
                0: self.Monday,
                1: self.Tuesday,
                2: self.Wednesday,
                3: self.Thursday,
                4: self.Friday,
                5: self.Saturday,
                6: self.Sunday,
            }[index]
        except KeyError:
            return None


class BuffManagerConfig(CustomConfigObject):
    def __init__(self,
                 morning_message_channel_id: int = 0,
                 morning_message_hour: int = 0,
                 todays_buff_approved_roles_ids: [int] = None,
                 tomorrows_buff_approved_roles_ids: [int] = None,
                 this_week_buffs_approved_roles_ids: [int] = None,
                 next_week_buffs_approved_roles_ids: [int] = None,
                 buff_list: dict = None, weeks: dict = None):
        self.morning_message_channel_id: int = morning_message_channel_id
        self.morning_message_hour: int = morning_message_hour

        self.todays_buff_approved_roles_ids: [
            int] = [] if not todays_buff_approved_roles_ids else todays_buff_approved_roles_ids
        self.tomorrows_buff_approved_roles_ids: [
            int] = [] if not todays_buff_approved_roles_ids else tomorrows_buff_approved_roles_ids
        self.this_week_buffs_approved_roles_ids: [
            int] = [] if not todays_buff_approved_roles_ids else this_week_buffs_approved_roles_ids
        self.next_week_buffs_approved_roles_ids: [
            int] = [] if not todays_buff_approved_roles_ids else next_week_buffs_approved_roles_ids

        self.buff_list: dict = {} if buff_list is None else buff_list
        self.weeks: dict = {} if weeks is None else weeks

    @classmethod
    def from_json(cls, data):
        obj = cls()
        obj.__dict__ = data

        convert_dict_list(obj.buff_list, Buff)
        convert_dict_list(obj.weeks, Week)

        return obj
