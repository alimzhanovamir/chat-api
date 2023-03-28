import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roomId: string;

    @Column()
    user: string;

    @Column()
    username: string;

    @Column()
    text: string;
}
