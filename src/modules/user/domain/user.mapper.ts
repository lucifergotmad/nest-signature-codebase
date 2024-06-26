import { UserEntity } from './user.entity';
import { UserMongoEntity } from '../repository/user.mongo-entity';
import { DbMapper, MongoEntityProps } from 'src/core/base/domain/db-mapper';
import { staticImplements } from 'src/core/decorator/static-implements.decorator';
import { UserLevel } from './value-objects/user-level.value-object';
import { Email } from './value-objects/email.value-object';

@staticImplements<DbMapper<UserEntity, UserMongoEntity>>()
export class UserMapper {
  public static toPlainObject(
    entity: UserEntity,
  ): MongoEntityProps<UserMongoEntity> {
    const entityProps = entity.propsCopy;

    return {
      ...entityProps,
      email: entityProps.email.value,
      level: entityProps.level.value,
    };
  }

  public static toDomain(raw: UserMongoEntity): UserEntity {
    return new UserEntity(
      {
        fullname: raw.fullname,
        username: raw.username,
        password: raw.password,
        level: new UserLevel(raw.level),
        email: new Email(raw.email),
        created_by: raw.created_by,
      },
      raw._id,
    );
  }
}
