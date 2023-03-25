import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/modules/user/user.entity";
import { Repository } from "typeorm";
import { UserDto } from "./user.dto";


export type UserType = {
    id: number,
    username: string,
    password: string,
};

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

    async createUser(user: UserDto): Promise<UserType> {
        return this.userRepository.save(user);
    }

    // async changePassword(user: UserDto) {
        // this.userRepository.update(user);
    // }

    async findUserById(id: number): Promise<UserType> {
        console.log(id, typeof id);
        
        const user = await this.userRepository.findOneBy({ id });
        
        if (!user) {
            throw new HttpException(
                `No user {${id}} found`,
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
        return await this.userRepository.find();
    }
}