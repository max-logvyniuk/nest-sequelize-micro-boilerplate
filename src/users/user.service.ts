import {Inject, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../models/user.model';

@Injectable()
export class UsersService {
    constructor(
        @Inject('USER_REPOSITORY')
        private  userRepository: typeof  User,
    ) {}

    create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;
        user.password = createUserDto.password;
        user.login = createUserDto.login;

        return user.save();
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.findAll<User>({
            raw: true,
        });
    }

    findOne(where: {}): Promise<User> {
        return this.userRepository.findOne({
            where,
            raw: true,
        });
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        await user.destroy();
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
        const user = await this.findOne({
            id: userId,
        });

        const isRefreshTokenMatching = await bcrypt.compare(
            refreshToken,
            user.currentHashedRefreshToken,
        );

        if (isRefreshTokenMatching) {
            return user;
        }
    }

    async setCurrentRefreshToken(refreshToken: string, userId: string) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update({currentHashedRefreshToken}, {
            where: {
                id: userId,
            },
        });
    }

}
