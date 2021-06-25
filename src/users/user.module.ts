import {forwardRef, Module} from '@nestjs/common';

import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import {userProviders} from '../providers/user.provider';
// import {databaseProviders} from '../providers/database.providers';
import {DatabaseModule} from '../database/database.module';
import {AuthService} from '../authorization/auth.service';
import {JwtModule} from '@nestjs/jwt';
import {jwtConstants} from '../utils/constants';

@Module({
    imports: [
        DatabaseModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [
        UsersService,
        ...userProviders,
        AuthService,
    ],
    controllers: [UsersController],
    exports: [UsersService, ...userProviders],
})
export class UsersModule {}
