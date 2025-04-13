import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PriceService } from '../../price-tracking/services/price.service';
import { IPriceService } from '../../price-tracking/services/price.service.interface';
import { JwtAuthGuard } from '../../utils/guards/authentication.guard';
import { IFastifyRequestWithUserId } from '../../utils/guards/authentication.guard.interface';
import { ClassTransformerMapper } from '../../utils/mapper/class-transformer-mapper';
import { GuessResponseDTO } from '../dtos/guess-response.dto';
import { GuessDTO } from '../dtos/guess.dto';
import { GuessService } from '../services/guess.service';
import { IGuessService } from '../services/guess.service.interface';

@Controller('guess')
@UseGuards(JwtAuthGuard)
@ApiTags('guessing')
@ApiCookieAuth()
export class GuessController {
    constructor(
        @Inject(GuessService)
        private readonly _guessService: IGuessService,
        @Inject(PriceService)
        private readonly _priceService: IPriceService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: GuessDTO, description: 'The guess performed by the user' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GuessResponseDTO,
    })
    public async placeGuess(
        @Body() guessDto: GuessDTO,
        @Request() request: IFastifyRequestWithUserId,
    ): Promise<GuessResponseDTO> {
        const userId = request.userId;

        const currentPairPrice = await this._priceService.getCurrentPriceForPairOrZero(guessDto.pair);
        const placedGuess = await this._guessService.placeGuess(
            userId,
            guessDto.guess,
            currentPairPrice,
            guessDto.pair,
        );

        const mappedGuessDomainEntityToDTO = ClassTransformerMapper.map(GuessResponseDTO, placedGuess);

        return mappedGuessDomainEntityToDTO;
    }
}
