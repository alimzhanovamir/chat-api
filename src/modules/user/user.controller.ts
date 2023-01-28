import { Body, Controller, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.jwt.guard";
import { CreateUserDto } from "./user.dto";
import { UserType, UserService } from "./user.service";



@Controller()
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly UserService: UserService) {}

    @Post('user')
    createUser(@Body() body: CreateUserDto): Promise<UserType> {
        return this.UserService.createUser(body);
    }

    @Put('user')
    changeUserPassword(@Res() res ,@Body() body: CreateUserDto): void {
        this.UserService.changePassword(body);
        res.status(HttpStatus.OK).send();
    }

    @Get('user/:username')
    getUser(@Param() { username }): Promise<UserType | undefined> {
        return this.UserService.findUserByName(username);
    } 

    @Get('users')
    getUsers(): Promise<UserType[]> {
        return this.UserService.findAllUsers();
    }       
}