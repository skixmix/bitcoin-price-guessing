import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { GuessTypeEnum } from '../dtos/guess.dto';

@Entity({ name: 'guesses' })
export class Guess {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    @Index()
    user_id: number;

    @Column({ default: false })
    @Index()
    is_resolved: boolean;

    @Column({ nullable: false })
    price_when_placed!: number;

    @Column({
        type: 'enum',
        enum: GuessTypeEnum,
        enumName: 'GuessTypeEnum',
        nullable: false,
    })
    guess!: GuessTypeEnum;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    @Index()
    created_at: Date;
}
