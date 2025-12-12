import { BeneficiosServicePort } from '../../domain/ports/input/beneficios.service.port';
import { BeneficiosRepositoryPort } from '../../domain/ports/output/beneficios.repository.port';
import { Beneficio } from '../../domain/entities/beneficio.entity';
import { BeneficioNotFoundException } from '../../domain/exceptions/domain.exceptions';

export class BeneficiosService implements BeneficiosServicePort {
    constructor(
        private readonly beneficiosRepository: BeneficiosRepositoryPort
    ) { }

    async getAllBeneficios(): Promise<Beneficio[]> {
        return this.beneficiosRepository.findAll();
    }

    async getBeneficioById(id: string): Promise<Beneficio> {
        const beneficio = await this.beneficiosRepository.findById(id);

        if (!beneficio) {
            throw new BeneficioNotFoundException(id);
        }

        return beneficio;
    }
}
