import { Inject, Injectable } from '@nestjs/common';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { GuessDatasource } from '../datasources/guess.datasource';
import { IGuessDataSource } from '../datasources/guess.datasource.interface';
import { GuessTypeEnum } from '../dtos/guess.dto';
import { GuessEntity, IGuessEntity } from '../entities/guess.entity';
import { IGuessRepository } from './guess.repository.interface';

@Injectable()
export class GuessRepository implements IGuessRepository {
    constructor(
        @Inject(GuessDatasource)
        private readonly _guessDatasource: IGuessDataSource,
    ) {}

    public async findUnresolvedGuessByUserIdAndPair(
        userId: number,
        pair: AvailablePairsEnum,
    ): Promise<IGuessEntity | undefined> {
        const previousGuessModel = await this._guessDatasource.findUnresolvedGuessByUserIdAndPair(userId, pair);

        if (!previousGuessModel) {
            return undefined;
        }

        const previousGuessEntity = new GuessEntity();
        previousGuessEntity.isPlaced = true;
        previousGuessEntity.placedAt = previousGuessModel?.createdAt;

        return previousGuessEntity;
    }

    public async createGuess(
        userId: number,
        guess: GuessTypeEnum,
        currentPrice: number,
        pair: AvailablePairsEnum,
    ): Promise<IGuessEntity> {
        const placedGuessModel = await this._guessDatasource.createGuess(userId, guess, currentPrice, pair);

        const guessEntity = new GuessEntity();
        guessEntity.isPlaced = true;
        guessEntity.placedAt = placedGuessModel?.createdAt;

        return guessEntity;
    }
}
