import { ConfigService } from '@nestjs/config';
import { ENV } from 'src/constants/env.constants';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenPayload } from './token-payload.interface';
import { UsersService } from 'src/index-services';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(ENV.JWT_ACCESS_TOKEN_SECRET),
    });
    // // take JWT from cookies
    // super({
    //   jwtFromRequest: ExtractJwt.fromExtractors([
    //     (request: Request) => {
    //       return request?.cookies?.Authentication
    //         ? request?.cookies?.Authentication // Cookies Authorization
    //         : request.headers.authorization.split(' ')[1]; // Localstorage Authorization
    //     },
    //   ]),
    //   secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    // });
  }

  async validate(payload: TokenPayload) {
    return this.userService.findOne({
      id: payload.userId,
    });
  }
}
