import {Inject, Injectable} from '@nestjs/common';
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

        return user.save();
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.findAll<User>();
    }

    findOne(id: string): Promise<User> {
        return this.userRepository.findOne({
            where: {
                id,
            },
        });
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        await user.destroy();
    }

}
