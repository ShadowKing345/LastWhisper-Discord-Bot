import { DatabaseService } from "./databaseService.js";
export const dataSource = DatabaseService.createDataSource();
dataSource.setOptions({
    migrationsTableName: "typeorm_migrations",
    migrations: ["./src/migrations/**/*.ts"],
});
//# sourceMappingURL=migrationDataSource.js.map