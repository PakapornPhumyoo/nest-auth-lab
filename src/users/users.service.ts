// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    findByEmail(email: string) { //ค้นหาผู้ใช้โดยใช้ email
        return this.userModel.findOne({ email }).exec();
    }

    findByEmailWithPassword(email: string) { //ค้นหาผู้ใช้โดยใช้ email พร้อมรหัสผ่าน
        return this.userModel.findOne({ email }).select('+passwordHash').exec();
    }

    create(data: { email: string; passwordHash: string }) { //สร้างผู้ใช้ใหม่
        return this.userModel.create(data);
    }
}

