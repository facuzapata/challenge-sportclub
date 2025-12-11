import { Module } from '@nestjs/common';
import { BeneficiosController } from '../presentation/controllers/beneficios.controller';
import { GetAllBeneficiosUseCase } from '../application/use-cases/get-all-beneficios.use-case';
import { GetBeneficioByIdUseCase } from '../application/use-cases/get-beneficio-by-id.use-case';
import { SportclubBeneficiosRepository } from '../infrastructure/repositories/sportclub-beneficios.repository';
import { SportclubHttpClient } from '../infrastructure/http/sportclub-http.client';

@Module({
    controllers: [BeneficiosController],
    providers: [
        GetAllBeneficiosUseCase,
        GetBeneficioByIdUseCase,
        SportclubHttpClient,
        {
            provide: 'IBeneficiosRepository',
            useClass: SportclubBeneficiosRepository,
        },
    ],
})
export class BeneficiosModule { }
