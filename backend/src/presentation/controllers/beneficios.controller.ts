import {
    Controller,
    Get,
    Param,
    HttpStatus,
    HttpException,
    Logger,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger';
import { GetAllBeneficiosUseCase } from '../../application/use-cases/get-all-beneficios.use-case';
import { GetBeneficioByIdUseCase } from '../../application/use-cases/get-beneficio-by-id.use-case';
import { BeneficioResponseDto } from '../dtos/beneficio-response.dto';
import { ErrorResponseDto } from '../dtos/error-response.dto';
import {
    BeneficioNotFoundException,
    ExternalApiException,
    DataValidationException,
} from '../../domain/exceptions/domain.exceptions';

@ApiTags('beneficios')
@Controller('api/beneficios')
export class BeneficiosController {
    private readonly logger = new Logger(BeneficiosController.name);

    constructor(
        private readonly getAllBeneficiosUseCase: GetAllBeneficiosUseCase,
        private readonly getBeneficioByIdUseCase: GetBeneficioByIdUseCase,
    ) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener todos los beneficios',
        description: 'Retorna la lista completa de beneficios disponibles desde la API de Sportclub'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de beneficios obtenida exitosamente',
        type: [BeneficioResponseDto],
    })
    @ApiResponse({
        status: 502,
        description: 'Error al comunicarse con la API externa',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 422,
        description: 'Datos inválidos recibidos de la API',
        type: ErrorResponseDto,
    })
    async findAll(): Promise<BeneficioResponseDto[]> {
        try {
            this.logger.log('GET /api/beneficios - Fetching all beneficios');
            const beneficios = await this.getAllBeneficiosUseCase.execute();
            this.logger.log(`Successfully fetched ${beneficios.length} beneficios`);
            return beneficios;
        } catch (error) {
            this.logger.error(`Error fetching beneficios: ${error.message}`, error.stack);
            this.handleError(error);
        }
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un beneficio por ID',
        description: 'Retorna los detalles de un beneficio específico'
    })
    @ApiParam({
        name: 'id',
        description: 'ID del beneficio',
        example: '123',
    })
    @ApiResponse({
        status: 200,
        description: 'Beneficio encontrado',
        type: BeneficioResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Beneficio no encontrado',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 502,
        description: 'Error al comunicarse con la API externa',
        type: ErrorResponseDto,
    })
    async findOne(@Param('id') id: string): Promise<BeneficioResponseDto> {
        try {
            this.logger.log(`GET /api/beneficios/${id} - Fetching beneficio`);
            const beneficio = await this.getBeneficioByIdUseCase.execute(id);
            this.logger.log(`Successfully fetched beneficio ${id}`);
            return beneficio;
        } catch (error) {
            this.logger.error(`Error fetching beneficio ${id}: ${error.message}`, error.stack);
            this.handleError(error);
        }
    }

    private handleError(error: any): never {
        if (error instanceof BeneficioNotFoundException) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: error.message,
                    timestamp: new Date().toISOString(),
                },
                HttpStatus.NOT_FOUND,
            );
        }

        if (error instanceof DataValidationException) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    message: error.message,
                    timestamp: new Date().toISOString(),
                },
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }

        if (error instanceof ExternalApiException) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_GATEWAY,
                    message: error.message,
                    timestamp: new Date().toISOString(),
                },
                HttpStatus.BAD_GATEWAY,
            );
        }

        // Generic error
        throw new HttpException(
            {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor',
                timestamp: new Date().toISOString(),
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
