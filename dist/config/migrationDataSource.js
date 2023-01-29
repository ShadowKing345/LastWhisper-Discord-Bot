import { DatabaseService } from "./databaseService.js";
export const dataSource = DatabaseService.createDataSource();
dataSource.setOptions({ migrations: ["./src/migrations/**/*.ts"] });
//# sourceMappingURL=migrationDataSource.js.map