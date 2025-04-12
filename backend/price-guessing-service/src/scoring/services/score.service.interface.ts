export interface IScoreService {
    getOrInitializeScoreByUserId(userId: number): Promise<number>;
}
