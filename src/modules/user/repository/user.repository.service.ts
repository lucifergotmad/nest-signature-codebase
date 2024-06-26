import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserMongoEntity } from './user.mongo-entity';

import { UserEntity } from '../domain/user.entity';
import { UserMapper } from '../domain/user.mapper';

import { BaseRepository } from 'src/core/base/module/repository.base';
import { UserRepositoryPort } from 'src/modules/user/repository/user.repository.port';

@Injectable()
export class UserRepository
  extends BaseRepository<UserEntity, UserMongoEntity>
  implements UserRepositoryPort
{
  constructor(
    @InjectModel(UserMongoEntity.name)
    private userModel: Model<UserMongoEntity>,
  ) {
    super(userModel, UserMapper);
  }
}
