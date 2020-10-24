from enum import Enum
from discord.utils import get


class CogNames(Enum):
    ConfigManager = "ConfigManager"
    Debug = "Debug"
    General = "General"
    Logger = "Logger"

    CustomMessages = "CustomMessages"
    EventManager = "EventManager"
    ManagementTools = "ManagementTools"
    PlayManager = "PlayManager"
    MemberManager = "MemberManager"
    BuffManager = "BuffManager"


class TypeCondition(Enum):
    NONE = 0
    CHANNEL = 1
    USER = 2
    ROLE = 3
    BOOL = 4


TypeConditionCheck = {
            TypeCondition.NONE: lambda _, _v: True,
            TypeCondition.CHANNEL: lambda ctx, x: x in ctx.guild.channels,
            TypeCondition.USER: lambda ctx, x: x in ctx.guild.members,
            TypeCondition.ROLE: lambda ctx, x: x in ctx.guild.roles,
            TypeCondition.BOOL: lambda _, _v: True
        }
