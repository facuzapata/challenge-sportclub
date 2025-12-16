import { Test, TestingModule } from '@nestjs/testing';
import { BeneficiosController } from './beneficios.controller';
import { BeneficiosServicePort } from '../../../domain/ports/input/beneficios.service.port';
import { BeneficioNotFoundException, ExternalApiException, DataValidationException } from '../../../domain/exceptions/domain.exceptions';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('BeneficiosController', () => {
    let controller: BeneficiosController;
    let service: BeneficiosServicePort;

    const mockBeneficio = {
        id: 1,
        comercio: 'Test',
        descripcion: 'Desc',
        aclaracion: 'Acl',
        tarjeta: true,
        efectivo: false,
        vencimiento: '',
        categoria: 'Cat',
        imagenUrl: '',
    };

    beforeEach(async () => {
        const mockService: BeneficiosServicePort = {
            getAllBeneficios: jest.fn().mockResolvedValue([mockBeneficio]),
            getBeneficioById: jest.fn().mockResolvedValue(mockBeneficio),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [BeneficiosController],
            providers: [
                {
                    provide: 'BeneficiosServicePort',
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<BeneficiosController>(BeneficiosController);
        service = module.get<BeneficiosServicePort>('BeneficiosServicePort');
    });

    describe('findAll', () => {
        it('should return array of beneficios', async () => {
            const result = await controller.findAll();

            expect(result).toEqual([mockBeneficio]);
            expect(service.getAllBeneficios).toHaveBeenCalled();
        });

        it('should handle ExternalApiException', async () => {
            jest.spyOn(service, 'getAllBeneficios').mockRejectedValue(
                new ExternalApiException('API Error')
            );

            await expect(controller.findAll()).rejects.toThrow(HttpException);
            await expect(controller.findAll()).rejects.toThrow(
                expect.objectContaining({ status: HttpStatus.BAD_GATEWAY })
            );
        });

        it('should handle DataValidationException', async () => {
            jest.spyOn(service, 'getAllBeneficios').mockRejectedValue(
                new DataValidationException('Invalid data')
            );

            await expect(controller.findAll()).rejects.toThrow(HttpException);
            await expect(controller.findAll()).rejects.toThrow(
                expect.objectContaining({ status: HttpStatus.UNPROCESSABLE_ENTITY })
            );
        });

        it('should handle generic errors', async () => {
            jest.spyOn(service, 'getAllBeneficios').mockRejectedValue(
                new Error('Unknown error')
            );

            await expect(controller.findAll()).rejects.toThrow(HttpException);
            await expect(controller.findAll()).rejects.toThrow(
                expect.objectContaining({ status: HttpStatus.INTERNAL_SERVER_ERROR })
            );
        });
    });

    describe('findOne', () => {
        it('should return a beneficio', async () => {
            const result = await controller.findOne('1');

            expect(result).toEqual(mockBeneficio);
            expect(service.getBeneficioById).toHaveBeenCalledWith('1');
        });

        it('should handle BeneficioNotFoundException', async () => {
            jest.spyOn(service, 'getBeneficioById').mockRejectedValue(
                new BeneficioNotFoundException('999')
            );

            await expect(controller.findOne('999')).rejects.toThrow(HttpException);
            await expect(controller.findOne('999')).rejects.toThrow(
                expect.objectContaining({ status: HttpStatus.NOT_FOUND })
            );
        });

        it('should handle ExternalApiException', async () => {
            jest.spyOn(service, 'getBeneficioById').mockRejectedValue(
                new ExternalApiException('API Error')
            );

            await expect(controller.findOne('1')).rejects.toThrow(HttpException);
            await expect(controller.findOne('1')).rejects.toThrow(
                expect.objectContaining({ status: HttpStatus.BAD_GATEWAY })
            );
        });

        it('should handle DataValidationException', async () => {
            jest.spyOn(service, 'getBeneficioById').mockRejectedValue(
                new DataValidationException('Invalid data')
            );

            await expect(controller.findOne('1')).rejects.toThrow(HttpException);
            await expect(controller.findOne('1')).rejects.toThrow(
                expect.objectContaining({ status: HttpStatus.UNPROCESSABLE_ENTITY })
            );
        });

        it('should handle generic errors', async () => {
            jest.spyOn(service, 'getBeneficioById').mockRejectedValue(
                new Error('Unknown error')
            );

            await expect(controller.findOne('1')).rejects.toThrow(HttpException);
            await expect(controller.findOne('1')).rejects.toThrow(
                expect.objectContaining({ status: HttpStatus.INTERNAL_SERVER_ERROR })
            );
        });
    });
});
