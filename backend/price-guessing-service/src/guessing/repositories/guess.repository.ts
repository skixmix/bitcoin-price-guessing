import { Inject, Injectable } from '@nestjs/common';
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

    public async findUnresolvedGuessByUserId(userId: number): Promise<IGuessEntity | undefined> {
        const previousGuessModel = await this._guessDatasource.findUnresolvedGuessByUserId(userId);

        if (!previousGuessModel) {
            return undefined;
        }

        const previousGuessEntity = new GuessEntity();
        previousGuessEntity.isPlaced = true;
        previousGuessEntity.placedAt = previousGuessModel?.created_at;

        return previousGuessEntity;
    }

    public async createGuess(userId: number, guess: GuessTypeEnum, currentPrice: number): Promise<IGuessEntity> {
        const placedGuessModel = await this._guessDatasource.createGuess(userId, guess, currentPrice);

        const guessEntity = new GuessEntity();
        guessEntity.isPlaced = true;
        guessEntity.placedAt = placedGuessModel?.created_at;

        return guessEntity;
    }
}
