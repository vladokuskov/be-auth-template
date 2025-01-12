import dbService from '@/services/db.service';
import {
  DeepPartial,
  DeleteResult,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  RemoveOptions,
  SaveOptions,
  UpdateResult,
} from 'typeorm';

class EntityManager<T> {
  // Save method: Saves an entity and returns the saved entity.
  async save<T>(entity: DeepPartial<T>, options?: SaveOptions): Promise<T> {
    const repository = dbService.dataSource.getRepository(entity.constructor as EntityTarget<T>);
    return repository.save(entity, options);
  }

  // Remove method: Removes an entity and returns the removed entity.
  async remove<T>(entity: T, options?: RemoveOptions): Promise<T> {
    const repository = dbService.dataSource.getRepository<T>(entity.constructor as EntityTarget<T>);
    return repository.remove(entity, options);
  }

  // Find method: Finds multiple entities based on provided options.
  async find(entity: EntityTarget<T>, options?: FindManyOptions<T>): Promise<T[]> {
    const repository = dbService.dataSource.getRepository<T>(entity);
    return repository.find(options);
  }

  // FindOne method: Finds a single entity based on provided options.
  async findOne<T>(entity: EntityTarget<T>, options: FindOneOptions<T>): Promise<T | null> {
    const repository = dbService.dataSource.getRepository<T>(entity);
    return repository.findOne(options);
  }

  // Update method: Updates an entity and returns an UpdateResult.
  async update(entity: EntityTarget<T>, criteria: any, partialEntity: T): Promise<UpdateResult> {
    const repository = dbService.dataSource.getRepository<T>(entity);
    return repository.update(criteria, partialEntity);
  }

  // Delete method: Deletes an entity and returns a DeleteResult.
  async delete(target: EntityTarget<T>, criteria: any): Promise<DeleteResult> {
    const repository = dbService.dataSource.getRepository<T>(target);
    return repository.delete(criteria);
  }

  // Query method: Executes a raw SQL query.
  async query(query: string, parameters?: any[]): Promise<any> {
    return dbService.dataSource.query(query, parameters);
  }

  // Create method: Creates an entity based on a plain object.
  create<T>(entityClass: EntityTarget<T>, plainObject: DeepPartial<T>): T {
    return dbService.dataSource.getRepository<T>(entityClass).create(plainObject);
  }

  // Merge method: Merges multiple entities into one.
  merge<T>(entity: EntityTarget<T>, mergeIntoEntity: T, ...entityLikes: DeepPartial<T>[]): T {
    return dbService.dataSource.getRepository<T>(entity).merge(mergeIntoEntity, ...entityLikes);
  }

  async deleteWithCondition(
    entityClass: EntityTarget<T>,
    condition: string,
    parameters: {[key: string]: any},
  ): Promise<DeleteResult> {
    const result = await dbService.dataSource
      .getRepository(entityClass)
      .createQueryBuilder()
      .delete()
      .from(entityClass)
      .where(condition, parameters)
      .execute();
    return result;
  }
}

const em = new EntityManager<any>();
export default em;
