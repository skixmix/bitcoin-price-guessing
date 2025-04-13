import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { GuessTypeEnum } from '../dtos/guess.dto';

@Entity({ name: 'guesses' })
export class Guess {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    @Index()
    userId: number;

    @Column({
        nullable: false,
        type: 'enum',
        enum: AvailablePairsEnum,
    })
    @Index()
    referencePair: AvailablePairsEnum;

    @Column({ default: false })
    @Index()
    isResolved: boolean;

    @Column({ nullable: false })
    priceWhenPlaced!: number;

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
    createdAt: Date;
}
