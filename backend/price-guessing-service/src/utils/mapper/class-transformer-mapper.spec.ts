import { plainToInstance } from 'class-transformer';
import { ClassTransformerMapper } from './class-transformer-mapper';

jest.mock('class-transformer');

describe('ClassTransformerMapper', () => {
    let mockPlainToInstance: jest.Mock;

    beforeEach(() => {
        mockPlainToInstance = plainToInstance as jest.Mock;
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('map', () => {
        class DestinationClass {}

        it('should call plainToClass with the correct arguments', () => {
            const sourceObject = { foo: 'bar' };

            ClassTransformerMapper.map(DestinationClass, sourceObject);

            expect(mockPlainToInstance).toHaveBeenCalledWith(DestinationClass, sourceObject, {
                excludeExtraneousValues: true,
                exposeDefaultValues: true,
            });
        });
    });
});
