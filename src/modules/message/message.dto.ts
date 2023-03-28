import { IsEmail, IsNotEmpty } from "class-validator";

export class MessageDto {
    @IsNotEmpty()
    roomId: string;

    @IsNotEmpty()
    @IsEmail()
    user: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    text: string;
}
