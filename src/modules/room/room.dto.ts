import { IsNotEmpty } from "class-validator";

export class RoomDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    owner: string;
}
