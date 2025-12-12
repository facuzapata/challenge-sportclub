import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BeneficiosController } from '../adapters/input/rest/beneficios.controller';
import { BeneficiosService } from '../application/services/beneficios.service';
import { BeneficiosServicePort } from '../domain/ports/input/beneficios.service.port';
import { BeneficiosRepositoryPort } from '../domain/ports/output/beneficios.repository.port';
import { HttpClientPort } from '../domain/ports/output/http-client.port';
import { SportclubBeneficiosRepository } from '../adapters/output/sportclub/sportclub-beneficios.repository';
import { SportclubHttpClient } from '../adapters/output/sportclub/sportclub-http.client';

@Module({
    controllers: [BeneficiosController],
    providers: [
        {
            provide: 'HttpClientPort',
            useFactory: (configService: ConfigService) => {
                const logger = new Logger('SportclubHttpClient');
                return new SportclubHttpClient(
                    configService.get<string>('SPORTCLUB_API_URL'),
                    configService.get<number>('API_TIMEOUT', 10000),
                    logger
                );
            },
            inject: [ConfigService],
        },
        {
            provide: 'BeneficiosRepositoryPort',
            useFactory: (httpClient: HttpClientPort) => {
                const logger = new Logger('SportclubBeneficiosRepository');
                return new SportclubBeneficiosRepository(httpClient, logger);
            },
            inject: ['HttpClientPort'],
        },
        {
            provide: 'BeneficiosServicePort',
            useFactory: (repository: BeneficiosRepositoryPort) => {
                return new BeneficiosService(repository);
            },
            inject: ['BeneficiosRepositoryPort'],
        },
    ],
})
export class BeneficiosModule { }
