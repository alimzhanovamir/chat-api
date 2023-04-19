import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Public } from "src/decorators/public.decorator";
import { UserDto } from "./user.dto";
import { UserType, UserService } from "./user.service";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @Post("user")
    // @Public()
    // createUser(@Body() body: UserDto): Promise<UserType> {
    //     return this.userService.createUser(body);
    // }

    @Get("user/:id")
    getUser(@Param() { id }): Promise<UserType | undefined> {
        return this.userService.findUserById(id);
    }

    @Get("users")
    getUsers(): Promise<UserType[]> {
        return this.userService.findAllUsers();
    }
}
