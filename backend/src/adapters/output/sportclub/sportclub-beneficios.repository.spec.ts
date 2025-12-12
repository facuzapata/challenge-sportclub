import { SportclubBeneficiosRepository } from './sportclub-beneficios.repository';
import { HttpClientPort } from '../../../domain/ports/output/http-client.port';
import { DataValidationException } from '../../../domain/exceptions/domain.exceptions';

describe('SportclubBeneficiosRepository', () => {
    let repository: SportclubBeneficiosRepository;
    let httpClient: HttpClientPort;

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

    beforeEach(() => {
        const mockHttpClient: HttpClientPort = {
            get: jest.fn(),
        };

        const mockLogger = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
        };

        httpClient = mockHttpClient;
        repository = new SportclubBeneficiosRepository(httpClient, mockLogger);
    });

    describe('constructor', () => {
        it('should create repository without logger', () => {
            const mockHttpClient: HttpClientPort = { get: jest.fn() };
            const repo = new SportclubBeneficiosRepository(mockHttpClient);
            expect(repo).toBeDefined();
        });
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

        it('should handle errors and rethrow', async () => {
            const error = new Error('Network error');
            jest.spyOn(httpClient, 'get').mockRejectedValue(error);

            await expect(repository.findAll()).rejects.toThrow('Network error');
        });

        it('should map beneficio with default values', async () => {
            const minimalDto = {
                id: 1,
                comercio: 'Test',
                descripcion: 'Desc',
            };
            jest.spyOn(httpClient, 'get').mockResolvedValue([minimalDto]);

            const result = await repository.findAll();

            expect(result[0].aclaracion).toBe('');
            expect(result[0].tarjeta).toBe(false);
            expect(result[0].efectivo).toBe(false);
            expect(result[0].categoria).toBe('Sin categoría');
            expect(result[0].imagenUrl).toBe('');
        });
    });

    describe('findById', () => {
        it('should return a beneficio by id', async () => {
            jest.spyOn(httpClient, 'get').mockResolvedValue(mockBeneficioDto);

            const result = await repository.findById('1');

            expect(result).toBeDefined();
            expect(result?.id).toBe(1);
            expect(httpClient.get).toHaveBeenCalledWith('/beneficios/1');
        });

        it('should return null when not found (404)', async () => {
            const error = new Error('404 Not Found');
            jest.spyOn(httpClient, 'get').mockRejectedValue(error);

            const result = await repository.findById('999');

            expect(result).toBeNull();
        });

        it('should rethrow non-404 errors', async () => {
            const error = new Error('500 Server Error');
            jest.spyOn(httpClient, 'get').mockRejectedValue(error);

            await expect(repository.findById('1')).rejects.toThrow('500 Server Error');
        });

        it('should return null for invalid dto', async () => {
            jest.spyOn(httpClient, 'get').mockResolvedValue({ id: 1 });

            const result = await repository.findById('1');

            expect(result).toBeNull();
        });

        it('should handle mapping errors', async () => {
            const invalidDto = {
                id: 1,
                comercio: 'Test',
                descripcion: 'Desc',
            };

            jest.spyOn(httpClient, 'get').mockResolvedValue(invalidDto);

            const result = await repository.findById('1');

            expect(result).toBeDefined();
        });

        it('should return null when dto throws error during mapping', async () => {
            const corruptDto = {
                id: 1,
                comercio: 'Test',
                descripcion: 'Desc',
                get vencimiento() {
                    throw new Error('Corrupted data');
                },
            };

            jest.spyOn(httpClient, 'get').mockResolvedValue(corruptDto);

            const result = await repository.findById('1');

            expect(result).toBeNull();
        });
    });
});
