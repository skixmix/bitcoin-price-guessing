import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { GuessTypeEnum } from '../dtos/guess.dto';
import { Guess } from '../models/guess.model';
import { IGuessDataSource } from './guess.datasource.interface';

@Injectable()
export class GuessDatasource implements IGuessDataSource {
    constructor(
        @InjectRepository(Guess)
        private _guessDatabaseRepository: Repository<Guess>,
    ) {}

    public async findUnresolvedGuessByUserIdAndPair(userId: number, pair: AvailablePairsEnum): Promise<Guess | null> {
        const foundGuess = await this._guessDatabaseRepository.findOne({
            where: {
                userId: userId,
                referencePair: pair,
                isResolved: false,
            },
        });

        return foundGuess;
    }

    public async createGuess(
        userId: number,
        guess: GuessTypeEnum,
        currentPrice: number,
        pair: AvailablePairsEnum,
    ): Promise<Guess> {
        const createdGuess = this._guessDatabaseRepository.create({
            guess,
            userId: userId,
            priceWhenPlaced: currentPrice,
            referencePair: pair,
            createdAt: new Date(),
        });
        await this._guessDatabaseRepository.save(createdGuess);

        return createdGuess;
    }
}
