from objects import CustomConfigObject


class GeneralConfig(CustomConfigObject):
    def __init__(self, should_clear_command: bool = False, clear_command_exception_list=None, management_role_ids: [int] = None, prefix: str = "|"):
        self.should_clear_command: bool = should_clear_command
        self.clear_command_exception_list: [int] = [] if not clear_command_exception_list else clear_command_exception_list
        self.management_role_ids: [int] = [] if not management_role_ids else management_role_ids
        self.prefix: str = prefix
