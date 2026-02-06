// src/auth/auth.service.ts // จัดการการลงทะเบียนและการเข้าสู่ระบบผู้ใช้ รวมถึงการสร้าง JWT
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor( 
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    private normalizeEmail(email: string) { //ปรับรูปแบบอีเมลให้เป็นมาตรฐาน
        return email.trim().toLowerCase();
    }

    async signUp(dto: AuthDto) { //ลงทะเบียนผู้ใช้ใหม่
        const email = this.normalizeEmail(dto.email); //ปรับรูปแบบอีเมล
        const userExists = await this.usersService.findByEmail(email); //ตรวจสอบว่ามีผู้ใช้ด้วยอีเมลนี้แล้วหรือไม่
        if (userExists) throw new BadRequestException('Email นี้ถูกใช้งานแล้ว'); //ถ้ามีแล้วให้แจ้งข้อผิดพลาด

        const passwordHash = await argon2.hash(dto.password); //แฮชรหัสผ่านเพื่อความปลอดภัย
        // hash คือ การแปลงรหัสผ่านให้อยู่ในรูปแบบที่ไม่สามารถย้อนกลับได้
        // ดูจาก auth.dto.ts จะเห็นได้ว่ารหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร

        const newUser = await this.usersService.create({ //สร้างผู้ใช้ใหม่
            email, //ใช้ email ที่ปรับรูปแบบแล้ว
            passwordHash, //ใช้รหัสผ่านที่แฮชแล้ว
        });

        return this.signToken(String(newUser._id), newUser.email); //สร้าง JWT สำหรับผู้ใช้ใหม่
    }

    async signIn(dto: AuthDto) { //เข้าสู่ระบบผู้ใช้
        const email = this.normalizeEmail(dto.email); //ปรับรูปแบบอีเมล

        const user = await this.usersService.findByEmailWithPassword(email); //ค้นหาผู้ใช้พร้อมรหัสผ่าน
        if (!user) throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง'); //ถ้าไม่พบผู้ใช้ให้แจ้งข้อผิดพลาด

        const passwordMatches = await argon2.verify(user.passwordHash, dto.password); //ตรวจสอบรหัสผ่าน
        if (!passwordMatches) throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง'); //ถ้ารหัสผ่านไม่ตรงกันให้แจ้งข้อผิดพลาด
        // argon2 คือ ไลบรารีสำหรับการแฮชและตรวจสอบรหัสผ่านอย่างปลอดภัย

        return this.signToken(String(user._id), user.email); //สร้าง JWT สำหรับผู้ใช้ที่เข้าสู่ระบบสำเร็จ
    }

    async signToken(userId: string, email: string) { //สร้าง JWT สำหรับผู้ใช้ 
        const payload = { sub: userId, email }; //ข้อมูลที่จะเก็บใน JWT
        const token = await this.jwtService.signAsync(payload); //สร้าง JWT

        return { //ส่งคืน JWT
            access_token: token, //โทเค็นสำหรับการเข้าถึง
        };
    }
}
