import { readdir } from "fs/promises";
import path from "path";
import fs from "fs";
import Client from "../Client";
import { Awaited } from "discord.js";

class Task {
  name: string;
  timeout: number;
  run: (client: Client) => Awaited<void>;

  constructor(name: string, timeout: number, run: (client: Client) => Awaited<void>) {
    this.name = name;
    this.timeout = timeout;
    this.run = run;
  }
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
  if (!client) return;

  await readTasks((module: Task) => {
    const interval: NodeJS.Timer = setInterval(module.run, module.timeout, client);
    client.tasks.set(module.name, interval);
  });
}

export { Task, readTasks };
