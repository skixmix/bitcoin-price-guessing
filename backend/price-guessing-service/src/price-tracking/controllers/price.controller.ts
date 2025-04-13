import { Controller, HttpStatus, Inject, Logger, Param, ParseEnumPipe, Request, Sse, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext } from '@nestjs/microservices';
import { ApiCookieAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable, Subscriber } from 'rxjs';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { JwtAuthGuard } from '../../utils/guards/authentication.guard';
import { IFastifyRequestWithUserId } from '../../utils/guards/authentication.guard.interface';
import { IPriceDTO } from '../dtos/price.dto';
import { PriceService } from '../services/price.service';
import { IPriceService } from '../services/price.service.interface';

interface IUserStreamWithPair {
    pair: AvailablePairsEnum;
    subscriber: Subscriber<MessageEvent<IPriceDTO>>;
}

@Controller('price')
@ApiTags('price tracking')
export class PriceController {
    private readonly _userStreams = new Map<number, IUserStreamWithPair>();

    constructor(
        @Inject(PriceService)
        private readonly _priceService: IPriceService,
    ) {}

    @Sse('stream/:pair')
    @UseGuards(JwtAuthGuard)
    @ApiParam({ name: 'pair', enum: AvailablePairsEnum })
    @ApiCookieAuth()
    @ApiResponse({ status: HttpStatus.OK, description: 'The price stream for this specific pair and user' })
    async getPriceStreamForPair(
        @Param('pair', new ParseEnumPipe(AvailablePairsEnum)) pair: AvailablePairsEnum,
        @Request() request: IFastifyRequestWithUserId,
    ) {
        return new Observable<MessageEvent<IPriceDTO>>((subscriber) => {
            Logger.log(`New ${pair} price stream for user ${request.userId}`);
            this._userStreams.set(request.userId, {
                pair,
                subscriber,
            });

            request.raw.on('close', () => {
                Logger.log(`User ${request.userId} disconnected from ${pair} price stream`);
                this._userStreams.delete(request.userId);
                subscriber.complete();
            });
        });
    }

    @EventPattern('price/update/+')
    public async handlePairPriceUpdate(@Ctx() context: MqttContext): Promise<void> {
        const receivedTopic = context.getTopic();
        const selectedPair = this._extractPairFromTopic(receivedTopic) as AvailablePairsEnum;

        for (const subscribedUserId of this._userStreams.keys()) {
            const streamWithPair = this._userStreams.get(subscribedUserId);
            const isNotMatchingPair = streamWithPair.pair !== selectedPair;
            if (isNotMatchingPair) {
                continue;
            }
            const subscriber = streamWithPair.subscriber;

            Logger.log(`Emitting ${selectedPair} price to user ${subscribedUserId}`);

            const currentPairPrice = await this._priceService.getCurrentPriceForPairOrZero(selectedPair);
            this._emitPriceToUser(subscriber, currentPairPrice, selectedPair);
        }
    }

    private _emitPriceToUser(
        subscribedUser: Subscriber<MessageEvent<IPriceDTO>>,
        price: number,
        pair: AvailablePairsEnum,
    ) {
        subscribedUser.next({ data: { price, pair } } as MessageEvent<IPriceDTO>);
    }

    private _extractPairFromTopic(topic: string) {
        return topic.split('/')[2];
    }
}
