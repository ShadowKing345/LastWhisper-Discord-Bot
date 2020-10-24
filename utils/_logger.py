import logging

logger = logging.getLogger('discord')
logger.setLevel(logging.INFO)
file_handler = logging.FileHandler(filename='./files/bot.log', encoding='utf-8', mode='a')
file_handler.setFormatter(logging.Formatter('%(asctime)s:%(levelname)s:%(name)s: %(message)s'))

stdout_handler = logging.StreamHandler()
stdout_handler.setFormatter(logging.Formatter('%(levelname)s:%(name)s: %(message)s'))

logger.addHandler(file_handler)
logger.addHandler(stdout_handler)
