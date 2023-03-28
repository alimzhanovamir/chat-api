import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./modules/user/user.module";
import { UserEntity } from "./modules/user/user.entity";
import { AuthModule } from "./modules/auth/auth.module";
import { MessageModule } from "./modules/message/message.module";
import { RoomModule } from "./modules/room/room.module";
import { RoomEntity } from "./modules/room/room.entity";
import { MessageEntity } from "./modules/message/message.entity";
import { ChatModule } from "./modules/chat/chat.module";

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
                entities: [UserEntity, RoomEntity, MessageEntity],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UserModule,
        MessageModule,
        RoomModule,
        ChatModule,
    ],
    controllers: [],
    providers: [],
})
export class ApplicationModule {}
