import { AuthModule } from "./../auth/auth.module";
import { Module } from "@nestjs/common";
import { MessageModule } from "../message/message.module";
import { ChatGateway } from "./chat.gateway";
import { UserModule } from "../user/user.module";

@Module({
    imports: [MessageModule, UserModule, AuthModule],
    providers: [ChatGateway],
})
export class ChatModule {}
