import {ApiOkResponse, ApiOperation} from '@nestjs/swagger';
import {Body, Controller, Post, HttpCode, HttpStatus, UseGuards} from '@nestjs/common';
import {EventPattern} from '@nestjs/microservices';

import {AuthService} from './auth.service';
import {UsersService} from '../users/user.service';
import {RegisterDto} from './dto/register.dto';
import {CreateUserDto} from '../users/dto/create-user.dto';
import {LocalAuthGuard} from './passport/local-auth.guard';

@Controller('users')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {
    }

    @ApiOperation({summary: 'Register new user'})
    @EventPattern('user_registration')
    async register(registrationData: RegisterDto) {

        console.info('this.authService --', this.authService, registrationData);

        return this.authService.register(registrationData);
    }

    @ApiOkResponse({ description: 'Token created' })
    @ApiOperation({ summary: 'Login with email and password' })
    @HttpCode(HttpStatus.OK)
    // @UseGuards(LocalAuthGuard)
    @EventPattern('user_login')
    async loginJWT(userDto: CreateUserDto) {
        try {
            const user = await this.authService.getAuthenticatedUser(
                userDto.login,
                userDto.password,
            );
            const accessToken = `Bearer ${this.authService.getJwtAccessToken(user.id)}`;
            const refreshToken = `Bearer ${this.authService.getJwtRefreshToken(
                user.id,
            )}`;

            await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
            return { success: true, accessToken, refreshToken };
        } catch (error) {
            console.error('loginJWT error - ', error);
        }
    }
}
