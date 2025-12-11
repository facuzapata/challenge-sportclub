import { Beneficio } from '../entities/beneficio.entity';

export interface IBeneficiosRepository {
    findAll(): Promise<Beneficio[]>;
    findById(id: string): Promise<Beneficio | null>;
}
