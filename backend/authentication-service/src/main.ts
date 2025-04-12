import { ConsoleLogger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '0.0.0.0';

const SWAGGER_TITLE = 'API Docs';
const SWAGGER_VERSION = '1.0';

const logger = new ConsoleLogger({
    prefix: 'Microservice',
    logLevels: ['log', 'warn', 'error'],
});

async function bootstrap() {
    const selectedPort = process.env.PORT ?? DEFAULT_PORT;
    const selectedHost = process.env.HOST ?? DEFAULT_HOST;

    const bootstrapOptions: NestApplicationOptions = {
        logger,
    };

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), bootstrapOptions);

    const swaggerConfiguration = new DocumentBuilder().setTitle(SWAGGER_TITLE).setVersion(SWAGGER_VERSION).build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfiguration);
    SwaggerModule.setup('api-docs', app, swaggerDocument);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    await app.listen(selectedPort, selectedHost);
}

bootstrap()
    .then()
    .catch(function onBootstrapError(error) {
        logger.error('Error during bootstrap!', error);
    });
