// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
    email: string; //firld for user email
                   // unique คือไม่ให้มี email ซ้ำกัน 

    @Prop({ required: true, select: false })
    passwordHash: string; //field for hashed password
                          // required คือ ต้องมีค่า ห้ามว่าง 
                          // select: false คือ ไม่ให้แสดง field นี้เมื่อดึงข้อมูล user
}

export const UserSchema = SchemaFactory.createForClass(User);

