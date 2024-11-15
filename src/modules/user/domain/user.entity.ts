import { Entity } from 'src/core/base/domain/entity';
import { HashService } from 'src/helper/modules/hash/hash.service';
import { UserRole } from './value-objects/user-role.value-object';
import { Types } from 'mongoose';
import { Email } from './value-objects/email.value-object';

export interface UserCommunicationProps {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export interface UserAuthProps {
  api_token: string;
  refresh_token: string;
}

export interface UserProps {
  username: string;
  password: string;
  email: Email;
  firstname: string;
  lastname: string;
  fullname: string;
  phone?: string;
  role: UserRole;
  communication?: UserCommunicationProps;
  is_2fa_enabled: boolean;
  is_email_verified: boolean;
  secret_2fa?: string;
  created_by: string;
}

export interface UpdateUserProps
  extends Omit<UserProps, 'password' | 'created_by' | 'role'> {}

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
      email: props.email,
      firstname: props.firstname,
      lastname: props.lastname,
      fullname: props.fullname,
      phone: props.phone,
      role: props.role,
      communication: props.communication,
      is_2fa_enabled: props.is_2fa_enabled,
      is_email_verified: props.is_email_verified,
      secret_2fa: props.secret_2fa,
      created_by: props.created_by,
    });
  }

  static async comparePassword(rawPassword: string, hashedPassword: string) {
    return await this.hashUtil.compare(rawPassword, hashedPassword);
  }

  async updateUser(payload: UpdateUserProps) {
    this.props.firstname = payload.firstname;
    this.props.lastname = payload.lastname;
    this.props.fullname = payload.fullname;
    this.props.email = payload.email;
    this.props.is_2fa_enabled = payload.is_2fa_enabled;
    this.props.is_email_verified = payload.is_email_verified;
  }
}
