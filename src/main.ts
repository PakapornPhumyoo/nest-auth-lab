// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ // การตั้งค่าสำหรับการตรวจสอบข้อมูลขาเข้า
      whitelist: true, // ลบคุณสมบัติที่ไม่ได้ระบุไว้ใน DTO ออก
      forbidNonWhitelisted: true, // แจ้งข้อผิดพลาดหากมีคุณสมบัติที่ไม่ได้ระบุไว้ใน DTO
      transform: true, // แปลงข้อมูลขาเข้าให้ตรงกับประเภทที่กำหนดใน DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

