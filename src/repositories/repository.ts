import { Repository as Repo, EntityTarget, FindOneOptions, FindManyOptions, FindOptionsWhere } from "typeorm";
import { DatabaseService } from "../config/databaseService.js";
import { RepositoryError } from "../utils/errors/index.js";
import { EntityBase } from "../entities/entityBase.js";

/**
 * Base repository object.
 * Manages the majority of basic CRUD repository actions.
 */
export abstract class Repository<T extends EntityBase> {
  protected repo: Repo<T>;

  protected constructor(protected db: DatabaseService, private entityTarget: EntityTarget<T>) {
  }

  /**
   * Saves a new database record.
   * Returns the newly corrected record.
   * @param obj The object to save.
   * @return The newly created object.
   */
  public async save(obj: T): Promise<T> {
    this.isConnected();

    return this.repo.save(obj);
  }

  /**
   * Finds the first instance of object given the filter.
   * @param filter Filter of the object.
   * @return The object or null if none was found.
   */
  public async findOne(filter: FindOneOptions<T>): Promise<T> {
    this.isConnected();

    return this.repo.findOne(filter);
  }

  /**
   * Finds all instances of an object given a filter.
   * @param filter The filter for the object.
   * @return A collection of all the found objects if any.
   */
  public async findAll(filter: FindManyOptions<T>): Promise<T[]> {
    this.isConnected();

    return this.repo.find(filter);
  }

  /**
   * Gets all records in the repository.
   * @return A collection of all the results.
   */
  public getAll(): Promise<T[]> {
    this.isConnected();

    return this.findAll({});
  }

  /**
   * Performs a bulk save of object on the repository.
   * @param objs Collection of all the objects to save.
   */
  public async bulkSave(objs: T[]): Promise<T[]> {
    this.isConnected();

    return this.repo.save(objs);
  }

  /**
   * Deletes an object from the repository.
   * @param filter The object to be deleted
   */
  public async delete(filter: FindOptionsWhere<T>): Promise<void> {
    await this.repo.delete(filter);
  }

  /**
   * Checks if the database connection is working. Throws if this is not the case.
   * @private
   */
  private isConnected(): void {
    if (!this.db.isConnected) {
      throw new RepositoryError("No valid connection to the database.");
    }

    if (this.repo == null) {
      this.repo = this.db.dataSource.getRepository<T>(this.entityTarget);
    }
  }
}
