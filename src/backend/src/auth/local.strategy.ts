import {
  BadRequestException,
  Injectable,
  Req,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);

    const reCaptchaRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=6LdIJocgAAAAAPWNShL8hrq9noGqrwK2oy3j_1ev&response=${req.body.captcha}`,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    if (reCaptchaRes.data.success !== true) {
      throw new UnprocessableEntityException(
        'Captcha is either expired, duplicate or invalid',
      );
    }
    if (!user) {
      throw new UnauthorizedException('Username or Password is invalid');
    }

    return user;
  }
}
