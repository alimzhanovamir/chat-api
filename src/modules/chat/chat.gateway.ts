import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

import { AuthService } from "../auth/auth.service";
import { MessageDto } from "../message/message.dto";
import { MessageService } from "../message/message.service";
import { UserService } from "../user/user.service";

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly messageService: MessageService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    handleConnection(client: Socket) {
        console.log(`Client ${client.id} connected.`);
    }

    @SubscribeMessage("join")
    handleJoin(client: Socket, roomId: number) {
        client.join(roomId.toString());
        return roomId;
    }

    @SubscribeMessage("leave")
    handleLeave(client: Socket, roomId: number) {
        client.leave(roomId.toString());
        return roomId;
    }

    @SubscribeMessage("message")
    async handleMessage(client: Socket, messageDto: MessageDto) {
        const message = await this.messageService.createMessage(messageDto);
        const { username } = await this.userService.findUserByEmail(
            message.user,
        );

        client.to(message.roomId.toString()).emit("message", {
            user: message.user,
            username: username,
            text: message.text,
        });

        return message;
    }

    handleDisconnect(client: Socket) {
        console.log(`Client ${client.id} disconnected`);
    }
}
