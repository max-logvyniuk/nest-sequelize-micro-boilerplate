import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { TokenPayload } from './token-payload.interface';
import { UsersService } from 'src/index-services';
import { ENV } from 'src/constants/env.constants';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(ENV.JWT_REFRESH_TOKEN_SECRET),
    });
    // super({
    //   jwtFromRequest: ExtractJwt.fromExtractors([
    //     (request: Request) => {
    //       return request?.cookies?.Refresh
    //         ? request?.cookies?.Refresh
    //         : request['Authorization'];
    //     },
    //   ]),
    //   secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
    //   passReqToCallback: true,
    // });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;
    return this.usersService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId,
    );
  }
}
