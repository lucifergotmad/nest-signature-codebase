import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ClientSession,
  FilterQuery,
  isValidObjectId,
  Model,
  SortOrder,
  Types,
  UpdateQuery,
} from 'mongoose';
import { BaseRepositoryPort } from '../../port/repository.base.port';
import { DbMapper } from '../domain/db-mapper';
import { TypeValidator } from '../../logic/type-validator';
import { IPaginationMeta } from 'src/core/interface/pagination-meta.interface';
import { IRepositoryResponse } from 'src/core/interface/repository-response.interface';

@Injectable()
export abstract class BaseRepository<Entity, MongoEntity>
  implements BaseRepositoryPort<Entity, MongoEntity>
{
  constructor(
    private readonly genericModel: Model<MongoEntity>,
    protected readonly mapper: DbMapper<Entity, MongoEntity>,
  ) {}

  async findAll(session: ClientSession | null = null): Promise<Entity[]> {
    const result = await this.genericModel.find().session(session);
    return result.map((it) => this.mapper.toDomain(it));
  }

  async findOne(
    identifier: FilterQuery<MongoEntity>,
    session: ClientSession | null = null,
  ): Promise<Entity | undefined> {
    const result = await this.genericModel.findOne(identifier).session(session);
    if (!result) return;
    return this.mapper.toDomain(result?.toObject());
  }

  async findOneOrThrow(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<Entity>;
  async findOneOrThrow(
    identifier: FilterQuery<MongoEntity>,
    errorMessage?: string,
    session?: ClientSession,
  ): Promise<Entity>;
  async findOneOrThrow(
    identifier: FilterQuery<MongoEntity>,
    paramTwo: string | ClientSession | null = null,
    paramThree: ClientSession | null = null,
  ): Promise<Entity> {
    const foundData = await this.genericModel
      .findOne(identifier)
      .session(typeof paramTwo !== 'string' ? paramTwo : paramThree);

    if (!foundData) {
      throw new NotFoundException(
        typeof paramTwo === 'string'
          ? paramTwo
          : `E 404: DATA ${this.constructor.name
              .replace('Repository', '')
              .toUpperCase()} NOT FOUND`,
      );
    }
    return this.mapper.toDomain(foundData);
  }

  async findOneAndThrow(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<void>;
  async findOneAndThrow(
    identifier: FilterQuery<MongoEntity>,
    errorMessage?: string,
    session?: ClientSession,
  ): Promise<void>;
  async findOneAndThrow(
    identifier: FilterQuery<MongoEntity>,
    paramTwo: string | ClientSession | null = null,
    paramThree: ClientSession | null = null,
  ): Promise<void> {
    const foundData = await this.genericModel
      .findOne(identifier)
      .session(typeof paramTwo !== 'string' ? paramTwo : paramThree);
    if (foundData) {
      throw new ConflictException(
        typeof paramTwo === 'string' ? paramTwo : `E 409: DATA ALREADY EXISTS`,
      );
    }
  }

  async findOneLatest(
    identifier: FilterQuery<MongoEntity>,
    session: ClientSession | null = null,
  ): Promise<Entity | undefined> {
    const result = await this.genericModel
      .findOne(identifier)
      .sort({ _id: -1 })
      .session(session);
    if (!result) return;

    return this.mapper.toDomain(result);
  }

  async findById(
    id: Types.ObjectId,
    session: ClientSession | null = null,
  ): Promise<Entity | undefined> {
    this._validateMongoID(id);
    const result = await this.genericModel.findById(id).session(session);
    if (!result) return;
    return this.mapper.toDomain(result);
  }

  async findBy(
    identifier: FilterQuery<MongoEntity>,
    session: ClientSession | null = null,
  ): Promise<Entity[]> {
    const result = await this.genericModel
      .aggregate([{ $match: identifier }])
      .session(session);

    return result.map((it) => this.mapper.toDomain(it));
  }

  async findByPaginated(
    identifier: FilterQuery<MongoEntity>,
    paginationMeta: IPaginationMeta,
  ) {
    const { limit = 100, skip = 0 } = paginationMeta;
    const result = await this.genericModel
      .find(identifier)
      .skip(skip)
      .limit(limit);

    return result.map((it) => this.mapper.toDomain(it));
  }

  async findByPaginateSorted(
    identifier: FilterQuery<MongoEntity>,
    paginationMeta: IPaginationMeta,
    sort: { [key: string]: SortOrder | { $meta: any } },
  ) {
    const { limit = 100, skip = 0 } = paginationMeta;
    const result = await this.genericModel
      .find(identifier)
      .skip(skip)
      .sort(sort)
      .limit(limit);

    return result.map((it) => this.mapper.toDomain(it));
  }

  async count(): Promise<number> {
    return await this.genericModel.find().countDocuments();
  }

  async countBy(identifier: FilterQuery<MongoEntity>): Promise<number> {
    return await this.genericModel.find(identifier).countDocuments();
  }

  async save(
    entity: Entity,
    session?: ClientSession,
  ): Promise<IRepositoryResponse> {
    const mongoEntity = new this.genericModel(
      this.mapper.toPlainObject(entity),
    );
    const newModel = new this.genericModel(mongoEntity);
    const result = await newModel.save({ session });
    return {
      _id: result._id as Types.ObjectId,
    };
  }
  async saveReturnDocument(
    entity: Entity,
    session?: ClientSession,
  ): Promise<MongoEntity> {
    const mongoEntity = new this.genericModel(
      this.mapper.toPlainObject(entity),
    );
    const newModel = new this.genericModel(mongoEntity);
    const result = await newModel.save({ session });

    return result?.toObject();
  }
  async saveMany(entities: Entity[], session?: ClientSession) {
    const mongoEntities = entities.map(
      (entity) => new this.genericModel(this.mapper.toPlainObject(entity)),
    );
    const mongoEntitiesEncrypted = mongoEntities;
    const saveResult = await this.genericModel.insertMany(
      mongoEntitiesEncrypted,
      { session },
    );
    return {
      n: saveResult.length,
    };
  }

  async updateOne(
    identifier: FilterQuery<MongoEntity>,
    data: Entity,
    session?: ClientSession,
  ): Promise<IRepositoryResponse> {
    if (identifier._id) this._validateMongoID(identifier._id);

    const { matchedCount, modifiedCount } = await this.genericModel.updateOne(
      identifier,
      this.mapper.toPlainObject(data),
      {
        session,
      },
    );

    if (!matchedCount) {
      throw new NotFoundException(
        `E 404: ${this.constructor.name
          .replace('Repository', '')
          .toUpperCase()} NOT FOUND, UPDATE FAILED`,
      );
    }

    return { n: matchedCount, nModified: modifiedCount };
  }

  async updateOneWithoutThrow(
    identifier: FilterQuery<MongoEntity>,
    data: Entity,
    session?: ClientSession,
  ): Promise<IRepositoryResponse> {
    if (identifier._id) this._validateMongoID(identifier._id);

    const { matchedCount: n } = await this.genericModel.updateOne(
      identifier,
      this.mapper.toPlainObject(data),
      {
        session,
      },
    );

    return { n };
  }

  async updateMany(
    identifier: FilterQuery<MongoEntity>,
    data: UpdateQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse> {
    if (identifier._id) this._validateMongoID(identifier._id);

    const { matchedCount: n } = await this.genericModel.updateMany(
      identifier,
      data,
      {
        session,
      },
    );

    return { n };
  }

  async delete(
    identifier: FilterQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse> {
    if (identifier._id) this._validateMongoID(identifier._id);

    const { deletedCount } = await this.genericModel.deleteMany(identifier, {
      session,
    });
    if (!deletedCount)
      throw new NotFoundException(
        `E 404: ${this.constructor.name
          .replace('Repository', '')
          .toUpperCase()} NOT FOUND, DELETE FAILED`,
      );
    return { n: deletedCount };
  }

  async deleteWithoutThrow(
    identifier: FilterQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse> {
    if (identifier._id) this._validateMongoID(identifier._id);

    const { deletedCount: n } = await this.genericModel.deleteMany(identifier, {
      session,
    });

    return { n };
  }

  async deleteAll(session?: ClientSession): Promise<IRepositoryResponse> {
    if (process.env.MODE === 'production') {
      throw new ForbiddenException(
        'DeleteBulk Feature Disabled in PRODUCTION mode.',
      );
    }
    const { deletedCount: n } = await this.genericModel.deleteMany(
      {},
      { session },
    );
    return { n };
  }

  prepareQuery(query: FilterQuery<MongoEntity>): FilterQuery<MongoEntity> {
    const ref = { ...query };
    Object.keys(ref).forEach((key) => {
      const value = ref[key];
      if (
        TypeValidator.isObject(value) &&
        !TypeValidator.isDate(value) &&
        !TypeValidator.isArray(value)
      ) {
        Object.keys(value).map((key2: string) => {
          value[`$${key2}`] = value[key2];
          delete value[key2];
        });
        return;
      }
    });
    return ref;
  }

  private _validateMongoID(_id: Types.ObjectId) {
    if (!isValidObjectId(_id))
      throw new BadRequestException('E 400: ID NOT VALID');
  }
}
