import {forwardRef, Inject, Injectable} from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    // private usersService: UsersService;
    constructor(
        // @Inject(UsersService)
        @Inject(UsersService)
        private readonly usersService: UsersService,
        // private readonly moduleRef: ModuleRef,
        @Inject(forwardRef(() => JwtService))
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
