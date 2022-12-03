import { RepositoryError } from "../utils/errors/index.js";
export class Repository {
    db;
    entityTarget;
    repo;
    constructor(db, entityTarget) {
        this.db = db;
        this.entityTarget = entityTarget;
    }
    async save(obj) {
        this.isConnected();
        return this.repo.save(obj);
    }
    async findOne(filter) {
        this.isConnected();
        return this.repo.findOne(filter);
    }
    async findAll(filter) {
        this.isConnected();
        return this.repo.find(filter);
    }
    getAll() {
        this.isConnected();
        return this.findAll({});
    }
    async bulkSave(objs) {
        this.isConnected();
        return this.repo.save(objs);
    }
    isConnected() {
        if (!this.db.isConnected) {
            throw new RepositoryError("No valid connection to the database.");
        }
        if (this.repo == null) {
            this.repo = this.db.dataSource.getRepository(this.entityTarget);
        }
    }
}
//# sourceMappingURL=repository.js.map