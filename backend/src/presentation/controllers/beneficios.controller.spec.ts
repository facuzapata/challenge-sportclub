import { Test, TestingModule } from '@nestjs/testing';
import { BeneficiosController } from './beneficios.controller';
import { GetAllBeneficiosUseCase } from '../../application/use-cases/get-all-beneficios.use-case';
import { GetBeneficioByIdUseCase } from '../../application/use-cases/get-beneficio-by-id.use-case';
import { BeneficioNotFoundException } from '../../domain/exceptions/domain.exceptions';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('BeneficiosController', () => {
    let controller: BeneficiosController;
    let getAllUseCase: GetAllBeneficiosUseCase;
    let getByIdUseCase: GetBeneficioByIdUseCase;

    const mockBeneficio = {
        id: 1,
        comercio: 'WALMART',
        descripcion: 'Descuento del 10% en electrónicos',
        aclaracion: 'Solo en tiendas físicas',
        tarjeta: true,
        efectivo: false,
        vencimiento: '2025-07-21T00:00:00',
        categoria: 'TECNOLOGIA',
        imagenUrl: 'https://asociate-api-challenge.prod.sportclub.com.ar/images/beneficio.jpg',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BeneficiosController],
            providers: [
                {
                    provide: GetAllBeneficiosUseCase,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
                {
                    provide: GetBeneficioByIdUseCase,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<BeneficiosController>(BeneficiosController);
        getAllUseCase = module.get<GetAllBeneficiosUseCase>(GetAllBeneficiosUseCase);
        getByIdUseCase = module.get<GetBeneficioByIdUseCase>(GetBeneficioByIdUseCase);
    });

    describe('findAll', () => {
        it('should return an array of beneficios', async () => {
            const result = [mockBeneficio];
            jest.spyOn(getAllUseCase, 'execute').mockResolvedValue(result);

            expect(await controller.findAll()).toBe(result);
            expect(getAllUseCase.execute).toHaveBeenCalled();
        });

        it('should throw HttpException on error', async () => {
            jest.spyOn(getAllUseCase, 'execute').mockRejectedValue(new Error('API Error'));

            await expect(controller.findAll()).rejects.toThrow(HttpException);
        });
    });

    describe('findOne', () => {
        it('should return a single beneficio', async () => {
            jest.spyOn(getByIdUseCase, 'execute').mockResolvedValue(mockBeneficio);

            expect(await controller.findOne('1')).toBe(mockBeneficio);
            expect(getByIdUseCase.execute).toHaveBeenCalledWith('1');
        });

        it('should throw 404 when beneficio not found', async () => {
            jest
                .spyOn(getByIdUseCase, 'execute')
                .mockRejectedValue(new BeneficioNotFoundException('1'));

            await expect(controller.findOne('1')).rejects.toThrow(HttpException);
            await expect(controller.findOne('1')).rejects.toMatchObject({
                status: HttpStatus.NOT_FOUND,
            });
        });
    });
});
