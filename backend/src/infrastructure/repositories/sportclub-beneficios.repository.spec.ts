import { Test, TestingModule } from '@nestjs/testing';
import { SportclubBeneficiosRepository } from './sportclub-beneficios.repository';
import { SportclubHttpClient } from '../http/sportclub-http.client';
import { DataValidationException } from '../../domain/exceptions/domain.exceptions';

describe('SportclubBeneficiosRepository', () => {
    let repository: SportclubBeneficiosRepository;
    let httpClient: SportclubHttpClient;

    const mockBeneficioDto = {
        id: 1,
        comercio: 'WALMART',
        descripcion: 'Descuento del 10%',
        aclaracion: 'Solo tiendas físicas',
        categoria: 'TECNOLOGIA',
        tarjeta: true,
        efectivo: false,
        vencimiento: '2025-07-21T00:00:00',
        imagenUrl: 'test.jpg',
    };

    beforeEach(async () => {
        const mockHttpClient = {
            get: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SportclubBeneficiosRepository,
                {
                    provide: SportclubHttpClient,
                    useValue: mockHttpClient,
                },
            ],
        }).compile();

        repository = module.get<SportclubBeneficiosRepository>(SportclubBeneficiosRepository);
        httpClient = module.get<SportclubHttpClient>(SportclubHttpClient);
    });

    describe('findAll', () => {
        it('should return array of beneficios', async () => {
            jest.spyOn(httpClient, 'get').mockResolvedValue([mockBeneficioDto]);

            const result = await repository.findAll();

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
            expect(result[0].comercio).toBe('WALMART');
            expect(httpClient.get).toHaveBeenCalledWith('/beneficios');
        });

        it('should throw DataValidationException when data is not array', async () => {
            jest.spyOn(httpClient, 'get').mockResolvedValue({ invalid: 'data' });

            await expect(repository.findAll()).rejects.toThrow(DataValidationException);
        });

        it('should filter out invalid beneficios', async () => {
            jest.spyOn(httpClient, 'get').mockResolvedValue([
                mockBeneficioDto,
                { id: 2 },
                { titulo: 'No ID' },
            ]);

            const result = await repository.findAll();

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        });
    });

    describe('findById', () => {
        it('should return a beneficio when found', async () => {
            jest.spyOn(httpClient, 'get').mockResolvedValue(mockBeneficioDto);

            const result = await repository.findById('1');

            expect(result).toBeDefined();
            expect(result?.id).toBe(1);
            expect(httpClient.get).toHaveBeenCalledWith('/beneficios/1');
        });

        it('should return null when beneficio not found (404)', async () => {
            jest.spyOn(httpClient, 'get').mockRejectedValue(new Error('404'));

            const result = await repository.findById('999');

            expect(result).toBeNull();
        });

        it('should return null for invalid data', async () => {
            jest.spyOn(httpClient, 'get').mockResolvedValue({ id: '1' });

            const result = await repository.findById('1');

            expect(result).toBeNull();
        });
    });
});
