import { Expose } from 'class-transformer';

export interface IUserEntity {
    id: number;
    username: string;
}

export class UserEntity implements IUserEntity {
    @Expose()
    id: number;

    @Expose()
    username: string;
}
