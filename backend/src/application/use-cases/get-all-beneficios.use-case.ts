import { Injectable, Inject } from '@nestjs/common';
import { Beneficio } from '../../domain/entities/beneficio.entity';
import { IBeneficiosRepository } from '../../domain/repositories/beneficios.repository.interface';

@Injectable()
export class GetAllBeneficiosUseCase {
    constructor(
        @Inject('IBeneficiosRepository')
        private readonly beneficiosRepository: IBeneficiosRepository,
    ) { }

    async execute(): Promise<Beneficio[]> {
        return this.beneficiosRepository.findAll();
    }
}
