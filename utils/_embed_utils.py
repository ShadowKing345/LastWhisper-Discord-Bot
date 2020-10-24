import random
from discord import Embed, Color
from datetime import date as date_object  # I have to do this to keep my ide from complaining.

from objects import Week, Buff


def get_date_suffix(d: int) -> str:
    return "th" if 11 <= d <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(d % 10, "th")


def get_index(date: date_object, week_length: int) -> (int, int):
    return date.isocalendar()[1] % week_length, date.weekday()


def get_date_buff_embed(title: str, date: date_object, buff: Buff) -> Embed:
    embed = Embed(
        title=title,
        description=str(date.strftime("%A %d" + get_date_suffix(date.day) + " %B %Y")),
        colour=get_random_color(),
    )

    embed.set_thumbnail(url=buff.image_url)
    embed.add_field(name="Buff", value=f"```ini\n{buff.title}```", inline=True)
    return embed


days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def get_weeks_buff_embed(week: Week, buffs: dict) -> Embed:
    embed = Embed(
        title=f"{week.name} Buffs Are:",
        colour=get_random_color()
    )

    for i in range(0, 7):
        embed.add_field(name=days[i], value=f"```\n{buffs[list(buffs.keys())[week.get_value(i)]].title}```")

    return embed


# def get_help_embed(doc: Help = None, docs: Help_docs = None, prefix: str = ""):
#     embed: Embed
#
#     if doc:
#         embed = Embed(
#             title="{}".format(doc.name),
#             description="```{}```".format(doc.description),
#             color=get_color()
#         )
#
#         for i in range(0, len(doc.syntax)):
#             embed.add_field(name="{}".format(str(i + 1)), value="```{}{}```".format(prefix, doc.syntax[i]))
#
#         embed.set_footer(text="Allowed roles: {}".format(str(doc.allowed_roles)))
#
#     elif docs:
#         embed = Embed(
#             name="Help",
#             description="For a more detailed view of a command do: {}help [name of command]".format(prefix),
#             color=get_color()
#         )
#
#         for doc in docs.docs.copy():
#             embed.add_field(name=doc.name, value="```{}```".format(doc.description), inline=False)
#
#     else:
#         return None
#
#     return embed


def get_random_color() -> Color:
    return Color.from_rgb(random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
