import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./modules/user/user.module";
import { UserEntity } from "./modules/user/user.entity";
import { AuthModule } from "./modules/auth/auth.module";
import { MessageModule } from "./modules/message/message.module";
import { ChatModule } from "./modules/room/room.module";
import { RoomEntity } from "./modules/room/room.entity";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.get("DB_HOST"),
                port: +configService.get<number>("DB_PORT"),
                username: configService.get("DB_USERNAME"),
                password: configService.get("DB_PASSWORD"),
                database: configService.get("DB_NAME"),
                entities: [UserEntity, RoomEntity],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UserModule,
        MessageModule,
        ChatModule,
    ],
    controllers: [],
    providers: [],
})
export class ApplicationModule {}
