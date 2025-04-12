import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

const MAX_USERNAME_LENGTH = 100;

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        length: MAX_USERNAME_LENGTH,
    })
    @Index()
    username: string;
}
