import { Controller, HttpStatus, Inject, Logger, Request, Sse, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable, Subscriber } from 'rxjs';
import { JwtAuthGuard } from '../../utils/guards/authentication.guard';
import { IFastifyRequestWithUserId } from '../../utils/guards/authentication.guard.interface';
import { IScoreDTO } from '../dtos/score.dto';
import { ScoreService } from '../services/score.service';
import { IScoreService } from '../services/score.service.interface';

@Controller('score')
@ApiTags('scoring')
@ApiCookieAuth()
export class ScoreController {
    private readonly _userStreams = new Map<number, Subscriber<MessageEvent<IScoreDTO>>>();

    constructor(
        @Inject(ScoreService)
        private readonly _scoreService: IScoreService,
    ) {}

    @Sse('strean')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.OK, description: 'The score stream for this specific user' })
    getScoreStream(@Request() request: IFastifyRequestWithUserId): Observable<MessageEvent<IScoreDTO>> {
        return new Observable<MessageEvent<IScoreDTO>>((subscriber) => {
            Logger.log('New score stream for user', request.userId);
            this._userStreams.set(request.userId, subscriber);

            this._scoreService
                .getOrInitializeScoreByUserId(request.userId)
                .then((score) => {
                    this._emitScoreToUser(subscriber, score);
                })
                .catch((error) => {
                    console.error(error);
                });

            request.raw.on('close', () => {
                Logger.log(`User ${request.userId} disconnected from score stream`);
                this._userStreams.delete(request.userId);
                subscriber.complete();
            });
        });
    }

    @EventPattern('score/update')
    public async handleScoreUpdateEvent(): Promise<void> {
        for (const subscribedUserId of this._userStreams.keys()) {
            Logger.log('Emitting score to user', subscribedUserId);
            const subscribedUser = this._userStreams.get(subscribedUserId);
            const currentUserScore = await this._scoreService.getOrInitializeScoreByUserId(subscribedUserId);
            this._emitScoreToUser(subscribedUser, currentUserScore);
        }
    }

    private _emitScoreToUser(subscribedUser: Subscriber<MessageEvent<IScoreDTO>>, score: number) {
        subscribedUser.next({ data: { score } } as MessageEvent<IScoreDTO>);
    }
}
