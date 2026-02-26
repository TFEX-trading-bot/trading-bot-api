import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: any) {
    // 🚩 ต้องมีคำว่า return ตรงนี้! ถ้าไม่มี มันจะส่ง {} กลับไปที่หน้าบ้าน
    return await this.authService.login(loginDto); 
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut() {
    // สำหรับ JWT ฝั่ง Client จะเป็นคนลบ Token ทิ้งเอง
    return { message: 'Signed out successfully' };
  }
}