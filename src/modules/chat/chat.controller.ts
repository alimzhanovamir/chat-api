import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatDto } from './chat.dto';
import { ChatService } from './chat.service';
import { ChatType } from './chat.types';

@Controller()
export class ChatController {
    constructor(private readonly ChatService: ChatService) {}

    @Post("chat")
    createChat(@Body() body: ChatDto): Promise<ChatType> {
        return this.ChatService.createChat(body);
    }

    @Get("chat/:id")
    getChatById(id: number) {
        return this.ChatService.getChatById(id);
    }
    
    @Get('chats')
    getAllChats() {
        return this.ChatService.getAllChats();
    }
}