import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    trim: true,
  })
  name: string;

  @Prop({
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop({
    default: false,
  })
  termsCondition: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
