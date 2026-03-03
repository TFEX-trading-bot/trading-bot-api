import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'supersecretkey_change_me_in_production', // ต้องตรงกับใน AppModule
    });
  }

  async validate(payload: any) {
    // return ค่านี้จะไปอยู่ที่ req.user
    return { userId: payload.user_id, username: payload.sub, role: payload.role };
  }
}