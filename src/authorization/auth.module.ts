import {forwardRef, Module} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { jwtConstants } from '../utils/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import {UsersService} from '../users/user.service';
import {userProviders} from '../providers/user.provider';
import {AuthController} from './auth.controller';
import {ConfigModule} from '@nestjs/config';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' },
        }),
        ConfigModule,
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, UsersService, ...userProviders],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
