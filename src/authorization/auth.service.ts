import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {ConfigService} from '@nestjs/config';

import { UsersService } from '../users/user.service';
import {PostgresErrorCode} from '../database/postgres-error-codes';
import {RegisterDto} from './dto/register.dto';
import {TokenPayload} from './passport/token-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @Inject(UsersService)
        private readonly usersService: UsersService,
        @Inject(JwtService)
        private readonly jwtService: JwtService,
        @Inject(ConfigService)
        private readonly configService: ConfigService,
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

    private async verifyPassword(
        plainTextPassword: string,
        hashedPassword: string,
    ) {
        const isPasswordMatching = await bcrypt.compare(
            plainTextPassword,
            hashedPassword,
        );
        if (!isPasswordMatching) {
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async register(registrationData: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);

        try {

            const checkIfUserExist = await this.usersService.findOne({
                login: registrationData.login,
            });

            console.info('checkIfUserExist ---', checkIfUserExist);

            if (checkIfUserExist) {
                return  new HttpException(
                    'User already exist',
                    HttpStatus.NOT_ACCEPTABLE,
                );
            }

            const createdUser = await this.usersService.create({
                ...registrationData,
                password: hashedPassword,
            });
            createdUser.password = undefined;
            return createdUser;
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException(
                    'User with such email already exists',
                    HttpStatus.BAD_REQUEST,
                );
            }
            console.log('registration error ---', error);
            throw new HttpException(
                'Something went wrong',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public getJwtAccessToken(userId: string) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.get(
                'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
            )}s`,
        });
        return token;
    }

    public getJwtRefreshToken(userId: string) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: `${this.configService.get(
                'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
            )}s`,
        });

        return token;
    }

    public async getAuthenticatedUser(login: string, plainTextPassword: string) {
        try {
            const user = await this.usersService.findOne({
                login,
            });
            await this.verifyPassword(plainTextPassword, user.password);
            user.password = undefined;
            return user;
        } catch (error) {
            console.error('getAuthenticatedUser error - ', error);
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
