import { Controller, Post, UseGuards, Body } from "@nestjs/common";
import { Public } from "src/decorators/public.decorator";
import { UserType } from "../user/user.service";
import { LocalAuthGuard } from "./auth.local.guard";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Public()
    @Post("login")
    async login(@Body() body: Omit<UserType, "username">) {
        return this.authService.login(body);
    }
}
