// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

type JwtPayload = { sub: string; email: string };   //โครงสร้างข้อมูลภายใน JWT
// JWT คือ JSON Web Token ซึ่งใช้สำหรับการยืนยันตัวตนและการแลกเปลี่ยนข้อมูลอย่างปลอดภัยระหว่างฝ่ายต่างๆ

@Injectable() 
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { 
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ดึง JWT จากส่วนหัวของคำขอ HTTP
            ignoreExpiration: false, // ไม่ละเว้นการหมดอายุของ JWT
            secretOrKey: config.get<string>('JWT_SECRET') || '', // ใช้คีย์ลับจากการตั้งค่าเพื่อยืนยันความถูกต้องของ JWT 
        });
    }

    validate(payload: JwtPayload) { //ตรวจสอบความถูกต้องของ JWT
        return { userId: payload.sub, email: payload.email }; //ส่งคืนข้อมูลผู้ใช้ที่ตรวจสอบแล้ว
        //จะเจอข้อมูล userId และ email 
    }
}

