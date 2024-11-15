import { UserEntity } from './user.entity';
import { UserMongoEntity } from '../repository/user.mongo-entity';
import { DbMapper, MongoEntityProps } from 'src/core/base/domain/db-mapper';
import { staticImplements } from 'src/core/decorator/static-implements.decorator';
import { UserRole } from './value-objects/user-role.value-object';
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
      role: entityProps.role.value,
    };
  }

  public static toDomain(raw: UserMongoEntity): UserEntity {
    return new UserEntity(
      {
        firstname: raw.firstname,
        lastname: raw.lastname,
        fullname: raw.fullname,
        username: raw.username,
        password: raw.password,
        phone: raw.phone,
        role: new UserRole(raw.role),
        email: new Email(raw.email),
        communication: raw.communication,
        is_2fa_enabled: raw.is_2fa_enabled,
        is_email_verified: raw.is_email_verified,
        secret_2fa: raw.secret_2fa,
        created_by: raw.created_by,
      },
      raw._id,
    );
  }
}
