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

    async signUp(user: UserDto) {
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

        console.log(typeof bcrypt);

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

    async login(user: Omit<UserType, "username" | "id">) {
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

    async generateTokens(email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    email,
                },
                {
                    secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
                    expiresIn: "60s",
                },
            ),
            this.jwtService.signAsync(
                {
                    email,
                },
                {
                    secret: this.configService.get<string>(
                        "JWT_REFRESH_SECRET",
                    ),
                    expiresIn: "300s",
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async verifyToken(token: string) {
        return this.jwtService.verify(token);
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
