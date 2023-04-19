import { Controller, Post, UseGuards, Body, Res } from "@nestjs/common";
import { Public } from "src/decorators/public.decorator";
import { UserType } from "../user/user.service";
import { LocalAuthGuard } from "./auth.local.guard";
import { AuthService } from "./auth.service";
import { UserDto } from "../user/user.dto";
import { Response } from "express";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Public()
    @Post("login")
    async login(
        @Res() response: Response,
        @Body() body: Omit<UserType, "username">,
    ) {
        const authData = await this.authService.login(body);

        this.authService.setRefreshTokenCookie(
            response,
            authData.token.refreshToken,
        );

        response.status(200).send({
            token: authData.token.accessToken,
            userData: authData.userData,
        });
        return;
    }

    @Public()
    @Post("signUp")
    async signUp(@Res() response: Response, @Body() body: UserDto) {
        const authData = await this.authService.signUp(body);

        this.authService.setRefreshTokenCookie(
            response,
            authData.token.refreshToken,
        );

        response.status(200).send({
            token: authData.token.accessToken,
            userData: authData.userData,
        });
        return;
    }
}
