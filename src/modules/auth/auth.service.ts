import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService, UserType } from "../user/user.service";
import { UserDto } from "../user/user.dto";
import { UserEntity } from "../../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { TokenEntity } from "src/entities/token.entity";
import { ConfigService } from "@nestjs/config";

type AuthDataType = {
    token: {
        accessToken: string;
        refreshToken: string;
    };
    userData: Omit<UserType, "password" | "id">;
};

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(TokenEntity)
        private readonly tokenRepository: Repository<TokenEntity>,
    ) {}

    async signUp(user: UserDto): Promise<AuthDataType> {
        const existingUser = await this.userRepository.findOneBy({
            email: user.email,
        });

        const validateEmail = user.email.match(
            /^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/,
        );

        if (existingUser) {
            throw new HttpException(
                `Пользователь с e-mail {${user.email}} уже существует`,
                HttpStatus.BAD_REQUEST,
            );
        } else if (!validateEmail) {
            throw new HttpException(
                `E-mail {${user.email}} не валиден`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const newUserData: UserDto = {
            email: user.email,
            username: user.username,
            password: this.hash(user.password),
        };

        const { email, username } = await this.userService.createUser(
            newUserData,
        );

        const tokens = await this.generateTokens(email);

        await this.tokenRepository.save({
            email,
            token: tokens.refreshToken,
        });

        return {
            token: tokens,
            userData: { email, username },
        };
    }

    async login(
        user: Omit<UserType, "username" | "id">,
    ): Promise<AuthDataType> {
        const { email, username } = await this.userService.findUserByEmail(
            user.email,
        );

        const tokens = await this.generateTokens(user.email);

        const existingToken = await this.tokenRepository.findOneBy({ email });

        if (existingToken) {
            await this.tokenRepository.update(existingToken.id, {
                token: tokens.refreshToken,
            });
        } else {
            await this.tokenRepository.save({
                email,
                token: tokens.refreshToken,
            });
        }

        return {
            token: tokens,
            userData: { email, username },
        };
    }

    async logout(email: string, token: null) {
        const existingToken = await this.tokenRepository.findOneBy({ email });
        console.log({ existingToken, email });
        if (existingToken) {
            await this.tokenRepository.update(email, {
                token,
            });
        }
    }

    async refreshAccessToken(request, currentUser) {
        console.log(request.cookies);
        const refreshToken = request.cookies["refreshToken"];
        console.log({ refreshToken, currentUser });

        if (!refreshToken) {
            throw new HttpException(
                `Нет токена для обновления`,
                HttpStatus.UNAUTHORIZED,
            );
        }

        const existingToken = await this.tokenRepository.findOneBy({
            email: currentUser,
        });

        if (!existingToken) {
            throw new HttpException(
                `Нет токена для обновления`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const tokens = await this.generateTokens(currentUser);
        await this.tokenRepository.update(
            { email: currentUser },
            { token: tokens.refreshToken },
        );
        return tokens;
    }

    async validateUser(
        email: string,
        password: string,
    ): Promise<Omit<UserType, "password" | "id"> | null> {
        try {
            const user: UserType = await this.userService.findUserByEmail(
                email,
            );

            if (user && bcrypt.compareSync(password, user.password)) {
                const { email, username } = user;
                return { email, username };
            } else {
                this.throwAuthError();
            }
        } catch (error) {
            this.throwAuthError();
        }
    }

    async generateTokens(email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateToken(email),
            this.generateToken(email, true),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async generateToken(email: string, isRefreshToken = false) {
        return this.jwtService.signAsync(
            {
                email,
            },
            {
                secret: this.configService.get<string>(
                    isRefreshToken ? "JWT_REFRESH_SECRET" : "JWT_ACCESS_SECRET",
                ),
                expiresIn: isRefreshToken ? "45s" : "15s",
            },
        );
    }

    async verifyToken(token: string) {
        return this.jwtService.verify(token);
    }

    setRefreshTokenCookie(response, refreshToken: string) {
        response.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 45 * 1000,
        });
    }

    hash(data: string) {
        console.log(typeof bcrypt.hashSync);
        return bcrypt.hashSync(data, 10);
    }

    throwAuthError() {
        throw new HttpException(
            `Неправильные логин или пароль`,
            HttpStatus.UNAUTHORIZED,
        );
    }
}
