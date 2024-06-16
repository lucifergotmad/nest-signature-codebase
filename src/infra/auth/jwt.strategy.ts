import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from '../config/env.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(envService: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.variables.jwtSecretKey,
    });
  }

  async validate(payload: any) {
    if (payload.exp < Date.now() / 1000) {
      throw new BadRequestException('Token is expired!');
    }
    return { username: payload.sub };
  }
}
