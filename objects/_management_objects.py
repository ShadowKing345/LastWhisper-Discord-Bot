from objects import CustomConfigObject


class ManagementToolsConfig(CustomConfigObject):
    def __init__(self, clear_allowed_role_ids: [int] = None, clear_channel_id_blacklist: [int] = None):
        self.clear_allowed_role_ids: [int] = [] if not clear_allowed_role_ids else clear_allowed_role_ids
        self.clear_channel_id_blacklist: [int] = [] if not clear_channel_id_blacklist else clear_channel_id_blacklist
