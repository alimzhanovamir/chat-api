import {
    Controller,
    Post,
    UseGuards,
    Body,
    Res,
    Get,
    Req,
    Patch,
} from "@nestjs/common";
import { Public } from "src/decorators/public.decorator";
import { UserType } from "../user/user.service";
import { LocalAuthGuard } from "./auth.local.guard";
import { AuthService } from "./auth.service";
import { UserDto } from "../user/user.dto";
import { Response, Request } from "express";
import { AuthUser } from "src/decorators/auth-user.decorator";

type LogoutPatchType = {
    token: null;
};

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

        console.log({ authData });
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
    @Get("refreshToken")
    async refreshToken(
        @Req() request: Request,
        @AuthUser() currentUser: string,
    ) {
        const data = await this.authService.refreshAccessToken(
            request,
            currentUser,
        );

        return data;
    }

    @Patch("logout")
    async logout(
        @AuthUser() currentUser: string,
        @Body() body: LogoutPatchType,
    ) {
        console.log({ currentUser, body });
        this.authService.logout(currentUser, body.token);
    }
}
