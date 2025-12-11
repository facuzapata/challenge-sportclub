import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({ description: 'Código de estado HTTP', example: 404 })
    statusCode: number;

    @ApiProperty({ description: 'Mensaje de error', example: 'Beneficio con ID 123 no encontrado' })
    message: string;

    @ApiProperty({ description: 'Timestamp del error', example: '2024-12-10T10:30:00.000Z' })
    timestamp: string;

    @ApiProperty({ description: 'Ruta del endpoint', example: '/api/beneficios/123' })
    path: string;
}