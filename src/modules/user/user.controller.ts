import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateUserDto } from "./user.dto";
import { UserType, UserService } from "./user.service";



@Controller()
export class UserController {
    constructor(private readonly UserService: UserService) {}

    @Post('user')
    createUser(@Body() body: CreateUserDto): Promise<UserType> {
        return this.UserService.createUser(body);
    }

    @Get('user/:username')
    getUser(@Param() { username }): Promise<UserType | undefined> {
        return this.UserService.findUser(username);
    } 

    @Get('users')
    getUsers(): Promise<UserType[]> {
        return this.UserService.findAllUsers();
    }       
}