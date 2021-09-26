import { readdir } from "fs/promises";
import path from "path";
import fs from "fs";
import Client from "../Client";
import { Awaited, Client as DiscordClient } from "discord.js";

class Task {
  name: string;
  timeout: number;
  run: (client: Client) => Awaited<void>;
  onReady: boolean;

  constructor(name: string, timeout: number, run: (client: Client) => Awaited<void>, onReady: boolean = false) {
    this.name = name;
    this.timeout = timeout;
    this.run = run;
    this.onReady = onReady;
  }
}

async function waitTillReady(client: DiscordClient, checkAgainTime: number = 500) {
  while (!client.isReady)
    await new Promise(resolve => setTimeout(resolve, checkAgainTime));
}

async function readTasks(callback: (module: Task) => void) {
  const relativePath: string = __dirname;
  const folders = await readdir(relativePath);

  for (const folder of folders) {
    const folderPath = path.join(relativePath, folder);
    if (fs.lstatSync(folderPath).isFile()) continue;

    for (const file of await readdir(folderPath)) {
      const filePath = path.resolve(path.join(folderPath, file));

      if (!fs.lstatSync(filePath).isFile()) continue;

      callback((await import(filePath)).default as Task);
    }
  }
}

export default async (client: Client) => {
  await readTasks((module: Task) => {
    client.tasks.set(module.name, module);
  });


  for (const task of client.tasks.values()) {
    setInterval(task.run, task.timeout, client);
    task.run(client);
  }
}

export { Task, readTasks, waitTillReady };
