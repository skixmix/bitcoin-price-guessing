import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum GuessTypeEnum {
    UP = 'UP',
    DOWN = 'DOWN',
}

export interface IGuessDTO {
    guess: GuessTypeEnum;
}

export class GuessDTO implements IGuessDTO {
    @IsEnum(GuessTypeEnum)
    @ApiProperty({
        description: 'The guess performed by the user. Can either be UP or DOWN',
        example: 'UP',
    })
    guess: GuessTypeEnum;
}
