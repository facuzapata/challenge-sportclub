import { Injectable, Inject } from '@nestjs/common';
import { Beneficio } from '../../domain/entities/beneficio.entity';
import { IBeneficiosRepository } from '../../domain/repositories/beneficios.repository.interface';
import { BeneficioNotFoundException } from '../../domain/exceptions/domain.exceptions';

@Injectable()
export class GetBeneficioByIdUseCase {
    constructor(
        @Inject('IBeneficiosRepository')
        private readonly beneficiosRepository: IBeneficiosRepository,
    ) { }

    async execute(id: string): Promise<Beneficio> {
        const beneficio = await this.beneficiosRepository.findById(id);

        if (!beneficio) {
            throw new BeneficioNotFoundException(id);
        }

        return beneficio;
    }
}
