import { Beneficio } from '../../entities/beneficio.entity';

export interface BeneficiosRepositoryPort {
    findAll(): Promise<Beneficio[]>;
    findById(id: string): Promise<Beneficio | null>;
}
