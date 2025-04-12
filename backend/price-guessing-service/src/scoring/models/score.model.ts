import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'scores' })
export class Score {
    @PrimaryColumn({
        unique: true,
    })
    user_id: number;

    @Column()
    score: number;
}
