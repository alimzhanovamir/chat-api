import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomController } from "./room.controller";
import { RoomEntity } from "./room.entity";
import { ChatService } from "./room.service";

@Module({
    imports: [TypeOrmModule.forFeature([RoomEntity])],
    providers: [ChatService],
    controllers: [RoomController],
})
export class ChatModule {}
