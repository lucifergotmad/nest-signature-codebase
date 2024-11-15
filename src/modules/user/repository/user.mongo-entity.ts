import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoEntity } from 'src/core/base/domain/mongo-entity';
import { Role } from 'src/core/constant/app';

export class UserCommunicationMongoEntity {
  @Prop({ required: true })
  email: boolean;

  @Prop({ required: true })
  sms: boolean;

  @Prop({ required: true })
  whatsapp: boolean;
}

@Schema({ collection: 'tm_users' })
export class UserMongoEntity extends BaseMongoEntity<typeof UserMongoEntity> {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  fullname: string;

  @Prop({ required: false })
  phone?: string;

  @Prop({ required: true, enum: Role })
  role: string;

  @Prop({ required: false, type: UserCommunicationMongoEntity })
  communication?: UserCommunicationMongoEntity;

  @Prop({ required: true })
  is_2fa_enabled: boolean;

  @Prop({ required: true })
  is_email_verified: boolean;

  @Prop({ required: false })
  secret_2fa?: string;

  @Prop()
  created_by?: string;

  @Prop()
  created_at?: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserMongoEntity);
export const UserModel = [{ name: UserMongoEntity.name, schema: UserSchema }];
