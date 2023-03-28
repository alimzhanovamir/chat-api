import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChatEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    user: string;
}
