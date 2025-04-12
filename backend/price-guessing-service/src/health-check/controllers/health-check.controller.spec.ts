import { HealthCheckController } from './health-check.controller';

describe('HealthCheckController', () => {
    let controller: HealthCheckController;

    beforeEach(() => {
        controller = new HealthCheckController();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('healthCheck', () => {
        it('should return OK', () => {
            const response = controller.healthCheck();

            expect(response).toBe('OK');
        });
    });
});
