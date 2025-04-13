import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { IPriceService } from '../../price-tracking/services/price.service.interface';
import { IFastifyRequestWithUserId } from '../../utils/guards/authentication.guard.interface';
import { GuessResponseDTO } from '../dtos/guess-response.dto';
import { GuessTypeEnum, IGuessDTO } from '../dtos/guess.dto';
import { IGuessEntity } from '../entities/guess.entity';
import { IGuessService } from '../services/guess.service.interface';
import { GuessController } from './guess.controller';

describe('GuessController', () => {
    let controller: GuessController;
    let mockGuessService: jest.Mocked<IGuessService>;
    let mockPriceService: jest.Mocked<IPriceService>;

    const mockRequest: IFastifyRequestWithUserId = {
        userId: 1,
    } as unknown as IFastifyRequestWithUserId;

    const mockBody: IGuessDTO = {
        guess: GuessTypeEnum.DOWN,
        pair: AvailablePairsEnum.BTC_USD,
    };

    const mockGuessEntity: IGuessEntity = {
        isPlaced: true,
        placedAt: new Date(),
    };

    beforeEach(() => {
        mockGuessService = {
            placeGuess: jest.fn(),
        } as unknown as jest.Mocked<IGuessService>;

        mockPriceService = {
            getCurrentPriceForPairOrZero: jest.fn(),
        } as unknown as jest.Mocked<IPriceService>;

        controller = new GuessController(mockGuessService, mockPriceService);

        mockGuessService.placeGuess.mockResolvedValue(mockGuessEntity);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('placeGuess', () => {
        it('should call the guess service', async () => {
            const fakePrice = 1;
            mockPriceService.getCurrentPriceForPairOrZero.mockResolvedValue(fakePrice);

            await controller.placeGuess(mockBody, mockRequest);

            expect(mockGuessService.placeGuess).toHaveBeenCalledWith(
                mockRequest.userId,
                mockBody.guess,
                fakePrice,
                mockBody.pair,
            );
        });

        it('should call the price service', async () => {
            await controller.placeGuess(mockBody, mockRequest);

            expect(mockPriceService.getCurrentPriceForPairOrZero).toHaveBeenCalledWith(mockBody.pair);
        });

        it('should return the guess DTO', async () => {
            const result = await controller.placeGuess(mockBody, mockRequest);

            expect(result).toBeInstanceOf(GuessResponseDTO);
        });

        it('should throw if the guess service throws', async () => {
            const error = new Error('Error');
            mockGuessService.placeGuess.mockRejectedValue(error);

            await expect(controller.placeGuess(mockBody, mockRequest)).rejects.toThrow(error);
        });
    });
});
