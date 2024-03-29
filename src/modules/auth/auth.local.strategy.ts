import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserType } from "../user/user.service";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: "email" });
    }

    async validate(
        email: string,
        password: string,
    ): Promise<Omit<UserType, "password" | "id">> {
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new HttpException(
                `Неправильные логин или пароль`,
                HttpStatus.UNAUTHORIZED,
            );
        }

        return user;
    }
}
