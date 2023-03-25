import { Body, Controller, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.jwt.guard";
import { UserDto } from "./user.dto";
import { UserType, UserService } from "./user.service";



@Controller()
// @UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly UserService: UserService) {}

    @Post('user')
    createUser(@Body() body: UserDto): Promise<UserType> {
        return this.UserService.createUser(body);
    }

    // @Put('user')
    // changeUserPassword(@Res() res ,@Body() body: UserDto): void {
    //     this.UserService.changePassword(body);
    //     res.status(HttpStatus.OK).send();
    // }

    @Get('user/:id')
    getUser(@Param() { id }): Promise<UserType | undefined> {
        return this.UserService.findUserById(id);
    } 

    @Get('users')
    getUsers(): Promise<UserType[]> {
        return this.UserService.findAllUsers();
    }       
}