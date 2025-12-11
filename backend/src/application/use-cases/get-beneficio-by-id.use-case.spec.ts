import { Test, TestingModule } from '@nestjs/testing';
import { GetBeneficioByIdUseCase } from './get-beneficio-by-id.use-case';
import { IBeneficiosRepository } from '../../domain/repositories/beneficios.repository.interface';
import { BeneficioNotFoundException } from '../../domain/exceptions/domain.exceptions';

describe('GetBeneficioByIdUseCase', () => {
    let useCase: GetBeneficioByIdUseCase;
    let repository: IBeneficiosRepository;

    const mockBeneficio = {
        id: '1',
        titulo: 'Beneficio 1',
        descripcion: 'Desc 1',
        categoria: 'Cat 1',
        empresa: 'Empresa 1',
    };

    beforeEach(async () => {
        const mockRepository = {
            findAll: jest.fn(),
            findById: jest.fn().mockResolvedValue(mockBeneficio),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetBeneficioByIdUseCase,
                {
                    provide: 'IBeneficiosRepository',
                    useValue: mockRepository,
                },
            ],
        }).compile();

        useCase = module.get<GetBeneficioByIdUseCase>(GetBeneficioByIdUseCase);
        repository = module.get<IBeneficiosRepository>('IBeneficiosRepository');
    });

    it('should return a beneficio when found', async () => {
        const result = await useCase.execute('1');

        expect(result).toEqual(mockBeneficio);
        expect(repository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw BeneficioNotFoundException when not found', async () => {
        jest.spyOn(repository, 'findById').mockResolvedValue(null);

        await expect(useCase.execute('999')).rejects.toThrow(BeneficioNotFoundException);
        await expect(useCase.execute('999')).rejects.toThrow('Beneficio con ID 999 no encontrado');
    });

    it('should propagate repository errors', async () => {
        jest.spyOn(repository, 'findById').mockRejectedValue(new Error('Repository error'));

        await expect(useCase.execute('1')).rejects.toThrow('Repository error');
    });
});
