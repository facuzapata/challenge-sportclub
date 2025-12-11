import { Test, TestingModule } from '@nestjs/testing';
import { GetAllBeneficiosUseCase } from './get-all-beneficios.use-case';
import { IBeneficiosRepository } from '../../domain/repositories/beneficios.repository.interface';

describe('GetAllBeneficiosUseCase', () => {
    let useCase: GetAllBeneficiosUseCase;
    let repository: IBeneficiosRepository;

    const mockBeneficios = [
        {
            id: '1',
            titulo: 'Beneficio 1',
            descripcion: 'Desc 1',
            categoria: 'Cat 1',
            empresa: 'Empresa 1',
        },
        {
            id: '2',
            titulo: 'Beneficio 2',
            descripcion: 'Desc 2',
            categoria: 'Cat 2',
            empresa: 'Empresa 2',
        },
    ];

    beforeEach(async () => {
        const mockRepository = {
            findAll: jest.fn().mockResolvedValue(mockBeneficios),
            findById: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetAllBeneficiosUseCase,
                {
                    provide: 'IBeneficiosRepository',
                    useValue: mockRepository,
                },
            ],
        }).compile();

        useCase = module.get<GetAllBeneficiosUseCase>(GetAllBeneficiosUseCase);
        repository = module.get<IBeneficiosRepository>('IBeneficiosRepository');
    });

    it('should return all beneficios', async () => {
        const result = await useCase.execute();

        expect(result).toEqual(mockBeneficios);
        expect(repository.findAll).toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
        jest.spyOn(repository, 'findAll').mockRejectedValue(new Error('Repository error'));

        await expect(useCase.execute()).rejects.toThrow('Repository error');
    });
});
