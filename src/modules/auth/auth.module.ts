import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./auth.local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { jwtAuthConstants } from "./auth.constants";
import { JwtAuthStrategy } from "./auth.jwt.strategy";

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtAuthConstants.secret,
            signOptions: { expiresIn: "24h" },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtAuthStrategy],
    exports: [AuthService],
})
export class AuthModule {}
