import { Awaited } from "discord.js";
import Client from "../Client";

export class Task {
  name: string;
  timeout: number;
  run: (client: Client) => Awaited<void>;

  constructor(name: string, timeout: number, run: (client: Client) => Awaited<void>) {
    this.name = name;
    this.timeout = timeout;
    this.run = run;
  }
}
