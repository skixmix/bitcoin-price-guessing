import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';

@Entity()
export class Price {
    @PrimaryColumn({
        type: 'enum',
        enum: AvailablePairsEnum,
    })
    pair: AvailablePairsEnum;

    @Column()
    price: number;

    @Column()
    updatedAt: Date;
}
