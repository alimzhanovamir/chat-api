import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MessageDto } from "./message.dto";
import { MessageEntity } from "./message.entity";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>,
    ) {}

    async createMessage(message: MessageDto) {
        return await this.messageRepository.save(message);
    }

    async getMessagesByRoomId(roomId: string) {
        const messages = await this.messageRepository.find({
            where: { roomId },
        });

        return messages;
    }
}
