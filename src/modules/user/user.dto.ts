import { IsEmail, IsNotEmpty } from "class-validator";

export class UserDto {
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
};