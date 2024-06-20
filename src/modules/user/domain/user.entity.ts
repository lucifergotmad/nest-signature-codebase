import { Entity } from 'src/core/base/domain/entity';
import { HashService } from 'src/helper/modules/hash/hash.service';
import { UserLevel } from './value-objects/user-level.value-object';
import { Types } from 'mongoose';
import { Email } from './value-objects/email.value-object';

export interface UserProps {
  fullname: string;
  email: Email;
  username: string;
  password: string;
  level: UserLevel;
  created_by: string;
}

export interface UpdateUserProps {
  fullname: string;
  email: Email;
  level: UserLevel;
}

export class UserEntity extends Entity<UserProps> {
  private static hashUtil: HashService = new HashService();

  constructor(props: UserProps, _id?: Types.ObjectId) {
    super(props, _id);
  }

  static async create(props: UserProps) {
    const hashPassword = await this.hashUtil.generate(props.password);

    return new UserEntity({
      fullname: props.fullname,
      email: props.email,
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
    this.props.fullname = payload.fullname;
    this.props.email = payload.email;
    this.props.level = payload.level;
  }
}
