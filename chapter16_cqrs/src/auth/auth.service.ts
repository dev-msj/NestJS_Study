import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import authConfig from 'src/config/authConfig';
import { UserInfo } from 'src/users/user-info.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  login(user: UserInfo) {
    const payload = { ...user };

    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: '1d',
      audience: 'example.com',
      issuer: 'example.com',
    });
  }

  verify(jwtString: string) {
    try {
      const payload = jwt.verify(jwtString, this.config.jwtSecret) as (
        | jwt.JwtPayload
        | string
      ) &
        UserInfo;

      const { uid, email } = payload;

      return {
        userId: uid,
        email,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
