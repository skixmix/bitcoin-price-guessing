import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/authentication.guard';
import { IFastifyRequestWithUserId } from '../../guards/authentication.guard.interface';
import { ClassTransformerMapper } from '../../utils/mapper/class-transformer-mapper';
import { GuessResponseDTO } from '../dtos/guess-response.dto';
import { GuessDTO } from '../dtos/guess.dto';
import { GuessService } from '../services/guess.service';
import { IGuessService } from '../services/guess.service.interface';

@Controller('guess')
@ApiTags('guessing')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
export class GuessController {
    constructor(
        @Inject(GuessService)
        private readonly _guessService: IGuessService,
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

        //TODO -> pass price
        const placedGuess = await this._guessService.placeGuess(userId, guessDto.guess, 1);

        const mappedGuessDomainEntityToDTO = ClassTransformerMapper.map(GuessResponseDTO, placedGuess);

        return mappedGuessDomainEntityToDTO;
    }
}
