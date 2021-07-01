import {Body, Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import {EventPattern} from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../models/user.model';
import { UsersService } from './user.service';
import {LocalAuthGuard} from '../authorization/passport/local-auth.guard';
import {LoginUserDto} from './dto/login-user.dto';
import {JwtAuthGuard} from '../authorization/passport/jwt-auth.guard';
import {AuthService} from '../authorization/auth.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        ) {}

    // @Post()
    // create(@Body() createUserDto: CreateUserDto): Promise<User> {
    //     return this.usersService.create(createUserDto);
    // }
    //
    // @Get()
    // findAll(): Promise<User[]> {
    //     return this.usersService.findAll();
    // }
    //
    // @Get(':id')
    // findOne(@Param('id') id: string): Promise<User> {
    //     return this.usersService.findOne(id);
    // }
    //
    // @Delete(':id')
    // remove(@Param('id') id: string): Promise<void> {
    //     return this.usersService.remove(id);
    // }
    // @UseGuards(LocalAuthGuard)
    // @Post('auth/login')
    // async login(@Request() req) {
    //     return this.authService.login(req.user);
    // }
    //
    // @UseGuards(JwtAuthGuard)
    // @Get('profile')
    // getProfile(@Request() req) {
    //     return req.user;
    // }

    // @EventPattern('user_create')
    async create(createUserDto: CreateUserDto): Promise<User> {
        console.info('create user', createUserDto);
        return this.usersService.create(createUserDto);
    }

    @UseGuards(LocalAuthGuard)
    @EventPattern('auth_login')
    async login(loginUserData: LoginUserDto) {
        return this.authService.login(loginUserData);
    }

    @UseGuards(JwtAuthGuard)
    @EventPattern('profile')
    getProfile(user: CreateUserDto) {
        return user;
    }

    @EventPattern('user_findAll')
    async findAll(): Promise<User[]> {
        const result = this.usersService.findAll();
        // tslint:disable-next-line:no-console
        console.info('findAll user', await result);
        return result;
    }

    @EventPattern('user_findOne')
    findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findOne(id);
    }

    @EventPattern('user_delete')
    remove(@Param('id') id: string): Promise<void> {
        return this.usersService.remove(id);
    }
}
