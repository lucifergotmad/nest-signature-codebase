import { Entity } from 'src/core/base/domain/entity';
import { HashService } from 'src/helper/modules/hash/hash.service';
import { UserLevel } from './value-objects/user-level.value-object';
import { Types } from 'mongoose';

export interface UserProps {
  username: string;
  password: string;
  level: UserLevel;
  created_by: string;
}

export interface UpdateUserProps {
  username: string;
  level: string;
}

export class UserEntity extends Entity<UserProps> {
  private static hashUtil: HashService = new HashService();

  constructor(props: UserProps, _id?: Types.ObjectId) {
    super(props, _id);
  }

  static async create(props: UserProps) {
    const hashPassword = await this.hashUtil.generate(props.password);

    return new UserEntity({
      username: props.username,
      password: hashPassword,
      level: props.level,
      created_by: props.created_by,
    });
  }

  static async comparePassword(rawPassword: string, hashedPassword: string) {
    return await this.hashUtil.compare(rawPassword, hashedPassword);
  }

  async updateUser(payload: UpdateUserProps) {
    this.props.level = new UserLevel(payload.level);
    this.props.username = payload.username;
  }
}
