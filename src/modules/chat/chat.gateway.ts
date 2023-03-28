import {
    ConnectedSocket,
    MessageBody,
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
        console.log("handleConnection");

        // const token = client.handshake.auth.token;
        // const payload = this.authService.verifyToken(token);

        // if (!payload) {
        //     client.disconnect(true);
        // } else {
        //     console.log(`Client ${client.id} connected. Auth token: ${token}`);
        // }
    }

    @SubscribeMessage("join")
    handleJoin(client: Socket, roomId: number) {
        console.log("handleJoin");

        console.log(`Client ${client.id} joined room: ${roomId}`);
        client.join(roomId.toString());
        return roomId;
    }

    @SubscribeMessage("leave")
    handleLeave(client: Socket, roomId: number) {
        console.log(`Client ${client.id} leaved room: ${roomId}`);
        client.leave(roomId.toString());
        return roomId;
    }

    @SubscribeMessage("message")
    async handleMessage(client: Socket, messageDto: MessageDto) {
        console.log(
            `Client ${client.id} sended message: ${messageDto.text} to roomId: ${messageDto.roomId}`,
        );
        const message = await this.messageService.createMessage(messageDto);
        const { username } = await this.userService.findUserByEmail(
            message.user,
        );

        console.log({ username, message });

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
