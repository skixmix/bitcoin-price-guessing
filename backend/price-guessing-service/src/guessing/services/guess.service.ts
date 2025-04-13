import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { GuessTypeEnum } from '../dtos/guess.dto';
import { IGuessEntity } from '../entities/guess.entity';
import { GuessRepository } from '../repositories/guess.repository';
import { IGuessRepository } from '../repositories/guess.repository.interface';
import { IGuessService } from './guess.service.interface';

@Injectable()
export class GuessService implements IGuessService {
    constructor(
        @Inject(GuessRepository)
        private readonly _guessRepository: IGuessRepository,
    ) {}

    public async placeGuess(
        userId: number,
        guess: GuessTypeEnum,
        currentPrice: number,
        pair: AvailablePairsEnum,
    ): Promise<IGuessEntity> {
        const previousGuess = await this._guessRepository.findUnresolvedGuessByUserIdAndPair(userId, pair);
        const isThereAPreviousGuess = previousGuess && previousGuess.isPlaced;

        if (isThereAPreviousGuess) {
            throw new ForbiddenException('There is already one guess placed that must still be resolved');
        }

        const placedGuess = await this._guessRepository.createGuess(userId, guess, currentPrice, pair);
        return placedGuess;
    }
}
