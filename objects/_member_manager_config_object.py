from objects import CustomConfigObject


class MemberManagerConfig(CustomConfigObject):
    def __init__(self, member_role_id: int = 0, new_member_role_id: int = 0, welcome_channel_id: int = 0, on_member_leave_logging_channel: int = 0):
        self.member_role_id: int = member_role_id
        self.new_member_role_id: int = new_member_role_id
        self.welcome_channel_id: int = welcome_channel_id
        self.on_member_leave_logging_channel: int = on_member_leave_logging_channel
