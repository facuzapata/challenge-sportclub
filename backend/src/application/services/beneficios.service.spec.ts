import { BeneficiosService } from './beneficios.service';
import { BeneficiosRepositoryPort } from '../../domain/ports/output/beneficios.repository.port';
import { BeneficioNotFoundException } from '../../domain/exceptions/domain.exceptions';

describe('BeneficiosService', () => {
    let service: BeneficiosService;
    let repository: BeneficiosRepositoryPort;

    const mockBeneficios = [
        {
            id: 1,
            comercio: 'Test 1',
            descripcion: 'Desc 1',
            aclaracion: 'Acl 1',
            tarjeta: true,
            efectivo: false,
            vencimiento: '',
            categoria: 'Cat 1',
            imagenUrl: '',
        },
    ];

    beforeEach(() => {
        const mockRepository: BeneficiosRepositoryPort = {
            findAll: jest.fn().mockResolvedValue(mockBeneficios),
            findById: jest.fn().mockResolvedValue(mockBeneficios[0]),
        };

        repository = mockRepository;
        service = new BeneficiosService(repository);
    });

    describe('getAllBeneficios', () => {
        it('should return all beneficios', async () => {
            const result = await service.getAllBeneficios();

            expect(result).toEqual(mockBeneficios);
            expect(repository.findAll).toHaveBeenCalled();
        });
    });

    describe('getBeneficioById', () => {
        it('should return a beneficio by id', async () => {
            const result = await service.getBeneficioById('1');

            expect(result).toEqual(mockBeneficios[0]);
            expect(repository.findById).toHaveBeenCalledWith('1');
        });

        it('should throw BeneficioNotFoundException when not found', async () => {
            jest.spyOn(repository, 'findById').mockResolvedValue(null);

            await expect(service.getBeneficioById('999')).rejects.toThrow(BeneficioNotFoundException);
        });
    });
});
