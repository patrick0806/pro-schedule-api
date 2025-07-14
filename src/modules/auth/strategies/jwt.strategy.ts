import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import env from '@config/env';
import { IAccessToken } from '@shared/interfaces/tokens.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env().application.jwt.secret,
    });
  }

  async validate(payload: IAccessToken) {
    return payload;
  }
}
