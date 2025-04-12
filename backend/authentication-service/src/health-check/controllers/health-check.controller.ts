import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health-check')
@Controller('status')
export class HealthCheckController {
    constructor() {}

    @ApiResponse({
        status: HttpStatus.OK,
        type: String,
        description: 'Ok, the microservice is up and running',
    })
    @Get()
    public healthCheck(): string {
        return 'OK';
    }
}
