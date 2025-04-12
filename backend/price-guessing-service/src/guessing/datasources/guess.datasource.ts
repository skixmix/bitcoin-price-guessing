import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuessTypeEnum } from '../dtos/guess.dto';
import { Guess } from '../models/guess.model';
import { IGuessDataSource } from './guess.datasource.interface';

@Injectable()
export class GuessDatasource implements IGuessDataSource {
    constructor(
        @InjectRepository(Guess)
        private _guessDatabaseRepository: Repository<Guess>,
    ) {}

    public async findUnresolvedGuessByUserId(userId: number): Promise<Guess | null> {
        const foundGuess = await this._guessDatabaseRepository.findOne({
            where: {
                user_id: userId,
                is_resolved: false,
            },
        });

        return foundGuess;
    }

    public async createGuess(userId: number, guess: GuessTypeEnum, currentPrice: number): Promise<Guess> {
        const createdGuess = this._guessDatabaseRepository.create({
            guess,
            user_id: userId,
            price_when_placed: currentPrice,
            created_at: new Date(),
        });
        await this._guessDatabaseRepository.save(createdGuess);

        return createdGuess;
    }
}
