export interface IScoreRepository {
    getScoreByUserId(userId: number): Promise<number | undefined>;
    upsertScoreForUser(userId: number, score: number): Promise<void>;
}
