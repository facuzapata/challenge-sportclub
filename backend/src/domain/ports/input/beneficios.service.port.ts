import { Beneficio } from '../../entities/beneficio.entity';

export interface BeneficiosServicePort {
    getAllBeneficios(): Promise<Beneficio[]>;
    getBeneficioById(id: string): Promise<Beneficio>;
}
