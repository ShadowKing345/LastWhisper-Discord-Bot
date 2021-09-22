import { readdir } from "fs/promises";
import fs from "fs";
import path from "path";
import Client from "../Client";

class Listener {
  run: (client: Client) => void;

  constructor(run: (client: Client) => void) {
    this.run = run;
  }
}

async function readListeners(callback: (module: Listener) => void) {
  const relativePath: string = __dirname;
  const folders = await readdir(relativePath);

  for (const folder of folders) {
    const folderPath = path.join(relativePath, folder);
    if (fs.lstatSync(folderPath).isFile()) continue;

    for (const file of await readdir(folderPath)) {
      const filePath = path.resolve(path.join(folderPath, file));

      if (!fs.lstatSync(filePath).isFile()) continue;

      callback((await import(filePath)).default as Listener);
    }
  }
}

export default async function(client: Client) {
  await readListeners((module: Listener) => module.run(client));
}

export { Listener, readListeners };
