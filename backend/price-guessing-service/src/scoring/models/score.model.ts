import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'scores' })
export class Score {
    @PrimaryColumn({
        unique: true,
    })
    userId: number;

    @Column()
    score: number;
}
