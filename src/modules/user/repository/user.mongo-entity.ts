import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoEntity } from 'src/core/base/domain/mongo-entity';

@Schema({ collection: 'tm_users' })
export class UserMongoEntity extends BaseMongoEntity<typeof UserMongoEntity> {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  level: string;

  @Prop()
  input_by?: string;

  @Prop()
  input_date?: Date;

  @Prop()
  edit_by?: string;

  @Prop()
  edit_date?: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserMongoEntity);
export const UserModel = [{ name: UserMongoEntity.name, schema: UserSchema }];