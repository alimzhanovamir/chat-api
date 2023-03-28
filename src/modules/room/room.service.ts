import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoomDto } from "./room.dto";
import { RoomEntity } from "./room.entity";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly chatRepository: Repository<RoomEntity>,
    ) {}

    async createRoom(chat: RoomDto) {
        return await this.chatRepository.save(chat);
    }

    async getRoomById(id: number) {
        return await this.chatRepository.findOneBy({ id });
    }

    async getAllRooms() {
        return await this.chatRepository.find();
    }
}
