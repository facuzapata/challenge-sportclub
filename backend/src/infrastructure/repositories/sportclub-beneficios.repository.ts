import { Injectable, Logger } from '@nestjs/common';
import { Beneficio } from '../../domain/entities/beneficio.entity';
import { IBeneficiosRepository } from '../../domain/repositories/beneficios.repository.interface';
import { SportclubHttpClient } from '../http/sportclub-http.client';
import { DataValidationException } from '../../domain/exceptions/domain.exceptions';

interface SportclubBeneficioDto {
    id?: number;
    comercio?: string;
    descripcion?: string;
    aclaracion?: string;
    tarjeta?: boolean;
    efectivo?: boolean;
    vencimiento?: string;
    categoria?: string;
    imagenUrl?: string;
}

@Injectable()
export class SportclubBeneficiosRepository implements IBeneficiosRepository {
    private readonly logger = new Logger(SportclubBeneficiosRepository.name);

    constructor(private readonly httpClient: SportclubHttpClient) { }

    async findAll(): Promise<Beneficio[]> {
        try {
            this.logger.log('Fetching all beneficios from Sportclub API');
            const data = await this.httpClient.get<SportclubBeneficioDto[]>('/beneficios');

            if (!Array.isArray(data)) {
                this.logger.error('Invalid data format: expected array');
                throw new DataValidationException('Formato de datos inválido recibido de la API');
            }

            return data.map((dto) => this.mapToEntity(dto)).filter((b) => b !== null) as Beneficio[];
        } catch (error) {
            this.logger.error(`Error fetching beneficios: ${error.message}`);
            throw error;
        }
    }

    async findById(id: string): Promise<Beneficio | null> {
        try {
            this.logger.log(`Fetching beneficio with ID: ${id}`);
            const data = await this.httpClient.get<SportclubBeneficioDto>(`/beneficios/${id}`);

            return this.mapToEntity(data);
        } catch (error) {
            this.logger.error(`Error fetching beneficio ${id}: ${error.message}`);

            if (error.message.includes('404')) {
                return null;
            }

            throw error;
        }
    }

    private mapToEntity(dto: SportclubBeneficioDto): Beneficio | null {
        try {
            if (!dto.id || !dto.comercio || !dto.descripcion) {
                this.logger.warn(`Invalid beneficio data: ${JSON.stringify(dto)}`);
                return null;
            }

            return {
                id: dto.id,
                comercio: dto.comercio,
                descripcion: dto.descripcion,
                aclaracion: dto.aclaracion || '',
                tarjeta: dto.tarjeta ?? false,
                efectivo: dto.efectivo ?? false,
                vencimiento: dto.vencimiento || '',
                categoria: dto.categoria || 'Sin categoría',
                imagenUrl: dto.imagenUrl || '',
            };
        } catch (error) {
            this.logger.error(`Error mapping beneficio: ${error.message}`);
            return null;
        }
    }
}
