import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatDto } from './chat.dto';
import { ChatEntity } from './chat.entity';

@Injectable()
export class ChatService {
    constructor(@InjectRepository(ChatEntity) private readonly chatRepository: Repository<ChatEntity>) {}

    async createChat(chat: ChatDto) {
        return await this.chatRepository.save(chat);
    }

    async getChatById(id: number) {
        return await this.chatRepository.findOneBy({ id });
    }

    async getAllChats() {
        return await this.chatRepository.find();
    }
}
