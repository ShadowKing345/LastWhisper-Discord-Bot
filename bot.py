import os
import discord
from discord.ext import commands

from cogs import general
import utils
from utils import logger

intents = discord.Intents.default()

client = commands.Bot(command_prefix=general.General.get_prefix, intents=intents)


@client.event
async def on_ready():
    logger.info("Ready")


if __name__ == "__main__":
    client.load_extension(f"cogs.general")
    client.load_extension(f"cogs.debug")
    client.load_extension(f"cogs.config_manager")
    for f in os.listdir("./cogs/extensions"):
        if f.endswith(".py"):
            client.load_extension(f"cogs.extensions.{f[:-3]}")

    client.run(utils.load_as_string("./token"))
    print("Good Bye!")

