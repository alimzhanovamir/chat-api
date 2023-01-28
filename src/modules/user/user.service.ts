import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/modules/user/user.entities";
import { Repository } from "typeorm";
import { CreateUserDto } from "./user.dto";


export type UserType = {
    id: number,
    username: string,
    password: string,
};

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

    async createUser(user: CreateUserDto): Promise<UserType> {
        return this.userRepository.save(user);
    }

    async changePassword(user: CreateUserDto) {
        // this.userRepository.update(user);
    }

    async findUserByName(username: string): Promise<UserType> {
        const user = await this.userRepository.findOneBy({ username });
        
        if (!user) {
            throw new HttpException(
                `No user {${username}} found`,
                HttpStatus.NOT_FOUND,
            );
        }

        return user;
    }

    async findUserByEmail(email: string): Promise<UserType> {
        const user = await this.userRepository.findOneBy({ email });
        
        if (!user) {
            throw new HttpException(
                `No user {${email}} found`,
                HttpStatus.NOT_FOUND,
            );
        }

        return user;
    }

    async findAllUsers(): Promise<UserType[]> {
        return this.userRepository.find();
    }
}