import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AuthUser } from "src/decorators/auth-user.decorator";
import { RoomDto } from "./room.dto";
import { RoomService } from "./room.service";
import { RoomType } from "./room.types";

@Controller()
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post("room")
    createRoom(@Body() body: RoomDto): Promise<RoomType> {
        return this.roomService.createRoom(body);
    }

    @Get("room/:id")
    getChatById(@Param() { id }) {
        return this.roomService.getRoomById(id);
    }

    @Get("rooms")
    getAllChats() {
        return this.roomService.getAllRooms();
    }

    @Delete("room/:roomId")
    deleteRoom(@AuthUser() currentUser: string, @Param() { roomId }) {
        return this.roomService.deleteRoom(roomId, currentUser);
    }
}
