import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TokenEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    token: string;
}
