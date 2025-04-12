export interface IScoreDatasource {
    getScoreByUserId(userId: number): Promise<number | null>;
    upsertScoreForUser(userId: number, score: number): Promise<void>;
}
