import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';

export enum GuessTypeEnum {
    UP = 'UP',
    DOWN = 'DOWN',
}

export interface IGuessDTO {
    guess: GuessTypeEnum;
    pair: AvailablePairsEnum;
}

export class GuessDTO implements IGuessDTO {
    @IsEnum(GuessTypeEnum)
    @ApiProperty({
        description: 'The guess performed by the user. Can either be UP or DOWN',
        example: 'UP',
    })
    guess: GuessTypeEnum;

    @IsEnum(AvailablePairsEnum)
    @ApiProperty({
        description: 'The pair the user is guessing on',
        example: 'BTCUSD',
    })
    pair: AvailablePairsEnum;
}
