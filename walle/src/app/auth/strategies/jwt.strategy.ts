import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from 'src/common/constants/settings.contant';
import { UserService } from 'src/app/user/user.service';
import * as passport from 'passport';

@Injectable()
export class JwtStrategy extends Strategy implements OnModuleInit {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: config.get<string>(JWT_SECRET)!,
      },
      async (payload: any, done: Function) => {
        try {
          const user = await this.validate(payload);
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      },
    );
  }

  onModuleInit() {
    passport.use('jwt', this);
  }

  async validate(payload: any) {
    if ('user_dni' in payload) {
      return await this.userService.findOneDni(payload.user_dni);
    }
    return null;
  }
}
