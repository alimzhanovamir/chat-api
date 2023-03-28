import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { RoomDto } from "./room.dto";
import { ChatService } from "./room.service";
import { RoomType } from "./room.types";

@Controller()
export class RoomController {
    constructor(private readonly chatService: ChatService) {}

    @Post("room")
    createRoom(@Body() body: RoomDto): Promise<RoomType> {
        return this.chatService.createRoom(body);
    }

    @Get("room/:id")
    getChatById(@Param() { id }) {
        return this.chatService.getRoomById(id);
    }

    @Get("rooms")
    getAllChats() {
        return this.chatService.getAllRooms();
    }
}
