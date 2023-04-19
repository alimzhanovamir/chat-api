import { MessageController } from "./message.controller";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageEntity } from "../../entities/message.entity";
import { MessageService } from "./message.service";

@Module({
    imports: [TypeOrmModule.forFeature([MessageEntity])],
    providers: [MessageService],
    controllers: [MessageController],
    exports: [MessageService],
})
export class MessageModule {}
