import { Beneficio } from '../../../domain/entities/beneficio.entity';
import { BeneficiosRepositoryPort } from '../../../domain/ports/output/beneficios.repository.port';
import { HttpClientPort } from '../../../domain/ports/output/http-client.port';
import { DataValidationException } from '../../../domain/exceptions/domain.exceptions';
import { SportclubBeneficioDto } from '../interfaces/SportclubBeneficioDto.interface';

export class SportclubBeneficiosRepository implements BeneficiosRepositoryPort {
    constructor(
        private readonly httpClient: HttpClientPort,
        private readonly logger?: { log: (msg: string) => void; error: (msg: string) => void; warn: (msg: string) => void }
    ) { }

    async findAll(): Promise<Beneficio[]> {
        try {
            if (this.logger) {
                this.logger.log('Fetching beneficios from Sportclub API');
            }
            const data = await this.httpClient.get<SportclubBeneficioDto[]>('/beneficios');

            if (!Array.isArray(data)) {
                if (this.logger) {
                    this.logger.error('Invalid data format: expected array');
                }
                throw new DataValidationException('Formato de datos inválido recibido de la API');
            }

            return data.map((dto) => this.mapToEntity(dto)).filter((b) => b !== null) as Beneficio[];
        } catch (error) {
            if (this.logger) {
                this.logger.error(`Error fetching beneficios: ${error.message}`);
            }
            throw error;
        }
    }

    async findById(id: string): Promise<Beneficio | null> {
        try {
            if (this.logger) {
                this.logger.log(`Fetching beneficio ID: ${id}`);
            }
            const data = await this.httpClient.get<SportclubBeneficioDto>(`/beneficios/${id}`);

            return this.mapToEntity(data);
        } catch (error) {
            if (this.logger) {
                this.logger.error(`Error fetching beneficio ${id}: ${error.message}`);
            }

            if (error.message.includes('404')) {
                return null;
            }

            throw error;
        }
    }

    private mapToEntity(dto: SportclubBeneficioDto): Beneficio | null {
        try {
            if (!dto.id || !dto.comercio || !dto.descripcion) {
                if (this.logger) {
                    this.logger.warn(`Invalid beneficio data: ${JSON.stringify(dto)}`);
                }
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
            if (this.logger) {
                this.logger.error(`Error mapping beneficio: ${error.message}`);
            }
            return null;
        }
    }
}
