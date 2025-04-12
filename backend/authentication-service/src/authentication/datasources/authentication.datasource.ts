import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.model';
import { IAuthenticationDatasource } from './authentication.datasource.interface';

@Injectable()
export class AuthenticationDatasource implements IAuthenticationDatasource {
    constructor(
        @InjectRepository(User)
        private _userDatabaseRepository: Repository<User>,
    ) {}

    public async findUserByUsername(username: string): Promise<User | null> {
        const foundUser = await this._userDatabaseRepository.findOne({
            where: {
                username,
            },
        });

        return foundUser;
    }

    public async createUser(username: string): Promise<User> {
        const createdUser = this._userDatabaseRepository.create({ username });
        await this._userDatabaseRepository.save(createdUser);

        return createdUser;
    }
}
