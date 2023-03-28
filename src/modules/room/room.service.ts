import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoomDto } from "./room.dto";
import { RoomEntity } from "./room.entity";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
    ) {}

    async createRoom(chat: RoomDto) {
        return await this.roomRepository.save(chat);
    }

    async getRoomById(id: number) {
        return await this.roomRepository.findOneBy({ id });
    }

    async getAllRooms() {
        return await this.roomRepository.find();
    }

    async deleteRoom(roomId: number, user: string) {
        console.log("Delete room", roomId, user);

        const room = await this.roomRepository.findOneBy({ id: roomId });

        if (room) {
            if (room.user === user) {
                return await this.roomRepository.delete(roomId);
            } else {
                throw new HttpException(
                    `У вас нет прав на удаление этой комнаты`,
                    HttpStatus.FORBIDDEN,
                );
            }
        } else {
            throw new HttpException(
                `Комната с id ${roomId} не существует`,
                HttpStatus.NOT_FOUND,
            );
        }
    }
}
