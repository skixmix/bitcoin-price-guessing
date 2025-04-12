import { Inject, Injectable } from '@nestjs/common';
import { ClassTransformerMapper } from '../../utils/mapper/class-transformer-mapper';
import { AuthenticationDatasource } from '../datasources/authentication.datasource';
import { IAuthenticationDatasource } from '../datasources/authentication.datasource.interface';
import { IUserEntity, UserEntity } from '../entities/user.entity';
import { User } from '../models/user.model';
import { IAuthenticationRepository } from './authentication.repository.interface';

@Injectable()
export class AuthenticationRepository implements IAuthenticationRepository {
    constructor(
        @Inject(AuthenticationDatasource) private readonly _authenticationDatasource: IAuthenticationDatasource,
    ) {}

    public async findUserByUsername(username: string): Promise<IUserEntity | undefined> {
        const foundUserModel = await this._authenticationDatasource.findUserByUsername(username);

        if (foundUserModel) {
            return this._mapUserModelToDomainEntity(foundUserModel);
        }

        return undefined;
    }

    public async createUser(username: string): Promise<IUserEntity> {
        const createdUserModel = await this._authenticationDatasource.createUser(username);
        return this._mapUserModelToDomainEntity(createdUserModel);
    }

    private _mapUserModelToDomainEntity(userModel: User): IUserEntity {
        return ClassTransformerMapper.map(UserEntity, userModel);
    }
}
