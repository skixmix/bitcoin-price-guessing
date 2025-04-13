import axios from 'axios';
import dotenv from 'dotenv';
import mqtt from 'mqtt';
import cron from 'node-cron';
import { Client } from 'pg';
import { SCORE_DELTA_DOWN, SCORE_DELTA_UP } from './constants/scoring.const';
import { GuessEnum } from './enums/guess.enum';
import { IUserGuess } from './interfaces/user-guess.interface';

const PAIR = 'BTCUSD';

dotenv.config();

const databaseClient = new Client({
    connectionString: process.env.DATABASE_URL,
});
databaseClient.connect();

const mqttClient = mqtt.connect(process.env.MQTT_URL);

const DEFAULT_TIMER_IN_SECONDS = 10;
const cronjobEveryNSeconds = process.env.INTERVAL_IN_SECONDS
    ? Number(process.env.INTERVAL_IN_SECONDS)
    : DEFAULT_TIMER_IN_SECONDS;
const cronjobString = `'*/${cronjobEveryNSeconds} * * * * *'`;

cron.schedule(
    cronjobString,
    async function updatePriceAndGuesses() {
        try {
            console.log('----- Running job');
            const newFetchedPrice = await fetchBTCPrice();
            const previousPrice = await getPreviousPrice();

            const hasPriceChanged = await hasPriceChangedFromLastIteration(newFetchedPrice, previousPrice);
            if (!hasPriceChanged) {
                console.log('---> Price not changed, skipping iteration');
                return;
            }

            await updatePairPrice(newFetchedPrice);

            const unresolvedGuesses = await getUnresolvedGuesses();
            if (unresolvedGuesses.length === 0) {
                console.log('---> No guess to update found');
            }

            for (const performedGuess of unresolvedGuesses) {
                const userScoreDelta = computeScoreDelta(
                    newFetchedPrice,
                    performedGuess.priceWhenPlaced,
                    performedGuess.guess,
                );
                const timeDeltaInSeconds = Math.floor(
                    (new Date().getTime() - performedGuess.createdAt.getTime()) / 1000,
                );
                console.log(`-----> Updating guess for user ${performedGuess.userId}`);
                console.log(`----------> Delta time: ${timeDeltaInSeconds} seconds`);
                console.log(`----------> Price when made: ${performedGuess.priceWhenPlaced}`);
                console.log(`----------> Price now: ${newFetchedPrice}`);
                console.log(`----------> Guess: ${performedGuess.guess}`);
                console.log(`----------> Delta: ${userScoreDelta}`);

                await updateUserScoreAndGuess(performedGuess.id, performedGuess.userId, userScoreDelta);
            }

            emitMqttTopicForPriceUpdate();
            emitMqttTopicForScoreUpdate();
            console.log('---- Job done!');
        } catch (err) {
            console.error('Error in job:', err);
            await databaseClient.query('ROLLBACK');
        }
    },
    {
        scheduled: true,
        runOnInit: true,
    },
);

async function fetchBTCPrice(): Promise<number> {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
            ids: 'bitcoin',
            vs_currencies: 'usd',
        },
    });
    return data.bitcoin.usd;
}

async function updatePairPrice(newFetchedPrice: number): Promise<void> {
    await databaseClient.query('UPDATE price SET price = $1, "updatedAt" = $2 WHERE pair = $3', [
        newFetchedPrice,
        new Date(),
        PAIR,
    ]);
}

async function getPreviousPrice(): Promise<number | null> {
    const {
        rows: [currentStoredPairPrice],
    } = await databaseClient.query(`SELECT price FROM price WHERE pair = $1 LIMIT 1`, [PAIR]);

    if (!currentStoredPairPrice || currentStoredPairPrice.price === null) {
        return null;
    }

    return currentStoredPairPrice?.price;
}

async function hasPriceChangedFromLastIteration(
    retrievedPriceFromApi: number,
    currentStoredPairPrice: number,
): Promise<boolean> {
    if (!currentStoredPairPrice) {
        await databaseClient.query('INSERT INTO price (pair, price, "updatedAt") VALUES ($1, $2, $3)', [
            PAIR,
            retrievedPriceFromApi,
            new Date(),
        ]);
        return false;
    }

    const isPriceChanged = currentStoredPairPrice !== retrievedPriceFromApi;
    return isPriceChanged;
}

async function getUnresolvedGuesses(): Promise<IUserGuess[] | null> {
    const { rows: foundUnresolvedGuessesInDb } = await databaseClient.query(
        `
    SELECT * FROM guesses
    WHERE "isResolved" = false
      AND EXTRACT(EPOCH FROM ( $1 - "createdAt")) >= 60
      AND "referencePair" = $2
  `,
        [new Date(), PAIR],
    );

    return foundUnresolvedGuessesInDb as IUserGuess[];
}

function computeScoreDelta(price: number, priceWhenPlaced: number, guess: GuessEnum): number {
    if (guess === GuessEnum.UP) {
        const isPriceIncreased = price > priceWhenPlaced;
        return isPriceIncreased ? SCORE_DELTA_UP : SCORE_DELTA_DOWN;
    }

    if (guess === GuessEnum.DOWN) {
        const isPriceDecreased = price < priceWhenPlaced;
        return isPriceDecreased ? SCORE_DELTA_UP : SCORE_DELTA_DOWN;
    }
}

async function updateUserScoreAndGuess(guessId: number, userId: number, userScoreDelta: number) {
    await databaseClient.query('BEGIN');

    await databaseClient.query(`UPDATE guesses SET "isResolved" = true WHERE id = $1`, [guessId]);
    await databaseClient.query(
        `
    INSERT INTO scores ("userId", score)
    VALUES ($1, $2)
    ON CONFLICT ("userId") DO UPDATE
    SET score = scores.score + EXCLUDED.score
    `,
        [userId, userScoreDelta],
    );

    await databaseClient.query('COMMIT');
}

function emitMqttTopicForPriceUpdate() {
    mqttClient.publish(`price/update/${PAIR}`, '');
}

function emitMqttTopicForScoreUpdate() {
    mqttClient.publish('score/update', '');
}
