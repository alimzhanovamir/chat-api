import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/modules/user/user.entity";
import { Repository } from "typeorm";
import { UserDto } from "./user.dto";


export type UserType = {
    id: number,
    username: string,
    email: string,
    password: string,
};

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

    async createUser(user: UserDto): Promise<UserType> {
        const existingUser = await this.userRepository.findOneBy({ email: user.email });
        const validateEmail = user.email.match(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/);

        if (existingUser) {
            throw new HttpException(
                `Пользователь с e-mail {${user.email}} уже существует`,
                HttpStatus.BAD_REQUEST,
            );
        } else if (!validateEmail) {
            throw new HttpException(
                `E-mail {${user.email}} не валиден`,
                HttpStatus.BAD_REQUEST,
            );
        } else {
            return this.userRepository.save(user);
        }
    }

    async findUserById(id: number): Promise<UserType> {
        const user = await this.userRepository.findOneBy({ id });
        
        if (!user) {
            throw new HttpException(
                `Пользователь {${id}} не найден`,
                HttpStatus.NOT_FOUND,
            );
        }

        return user;
    }

    async findUserByEmail(email: string): Promise<UserType> {
        const user = await this.userRepository.findOneBy({ email });
        
        if (!user) {
            throw new HttpException(
                `Пользователь с e-mail {${email}} не найден`,
                HttpStatus.NOT_FOUND,
            );
        }

        return user;
    }

    async findAllUsers(): Promise<UserType[]> {
        return await this.userRepository.find();
    }
}