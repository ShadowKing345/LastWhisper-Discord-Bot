import { DatabaseService } from "../../config/index.js";
import { buffManagerSeeder } from "./buffManagerSeeder.js";
import { eventManagerSeeder } from "./eventManagerSeeder.js";
import { isPromiseRejected } from "../index.js";
import { gardeningManagerSeeder } from "./gardeningManagerSeeder.js";
import { permissionManagerSeeder } from "./permissionManagerSeeder.js";
import { managerUtilsSeeder } from "./managerUtilsSeeder.js";
import { roleManagerSeeder } from "./roleManagerSeeder.js";

export async function seedDb(data: Record<string, unknown>) {
  const ds = DatabaseService.createDataSource();

  try {
    await ds.initialize();

    if (!("guildId" in data && typeof data.guildId === "string")) {
      throw new Error("You must have a guildId set in the object.");
    }

    const results = await Promise.allSettled([
      buffManagerSeeder(ds, data.guildId, data.buff_manager),
      eventManagerSeeder(ds, data.guildId, data.event_manager),
      gardeningManagerSeeder(ds, data.guildId, data.gardening_manager),
      permissionManagerSeeder(ds, data.guildId, data.permission_manager),
      managerUtilsSeeder(ds, data.guildId, data.manager_utils),
      roleManagerSeeder(ds, data.guildId, data.role_manager),
    ]);

    for (const result of results) {
      if (isPromiseRejected(result)) {
        console.error(result.reason);
      }
    }
  } finally {
    if (ds.isInitialized) {
      await ds.destroy();
    }
  }
}