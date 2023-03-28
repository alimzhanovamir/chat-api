import { IsNotEmpty } from "class-validator";

export class ChatDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    user: string;
}
