import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService, UserType } from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(
        email: string,
        password: string,
    ): Promise<Omit<UserType, "password"> | null> {
        try {
            const user: UserType = await this.userService.findUserByEmail(
                email,
            );

            if (user && user.password === password) {
                const { password, ...result } = user;
                return result;
            } else {
                this.throwAuthError();
            }
        } catch (error) {
            this.throwAuthError();
        }
    }

    async login(user: Omit<UserType, "username" | "id">) {
        const token = await this.generateToken(user);
        const userData = await this.userService.findUserByEmail(user.email);

        return {
            token,
            userData,
        };
    }

    async generateToken(user: Omit<UserType, "username" | "id">) {
        const payload = { email: user.email };

        return this.jwtService.sign(payload);
    }

    throwAuthError() {
        throw new HttpException(
            `Неправильные логин или пароль`,
            HttpStatus.UNAUTHORIZED,
        );
    }
}
