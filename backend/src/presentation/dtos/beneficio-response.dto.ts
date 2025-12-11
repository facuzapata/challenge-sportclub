import { ApiProperty } from '@nestjs/swagger';

export class BeneficioResponseDto {
    @ApiProperty({ description: 'ID único del beneficio', example: 1 })
    id: number;

    @ApiProperty({ description: 'Nombre del comercio', example: 'WALMART' })
    comercio: string;

    @ApiProperty({ description: 'Descripción del beneficio', example: 'Descuento del 10% en electrónicos' })
    descripcion: string;

    @ApiProperty({ description: 'Aclaración o términos adicionales', example: 'Solo en tiendas físicas' })
    aclaracion: string;

    @ApiProperty({ description: 'Acepta tarjeta', example: true })
    tarjeta: boolean;

    @ApiProperty({ description: 'Acepta efectivo', example: false })
    efectivo: boolean;

    @ApiProperty({ description: 'Fecha de vencimiento', example: '2025-07-21T00:00:00' })
    vencimiento: string;

    @ApiProperty({ description: 'Categoría del beneficio', example: 'TECNOLOGIA' })
    categoria: string;

    @ApiProperty({ description: 'URL de la imagen del beneficio', example: 'https://asociate-api-challenge.prod.sportclub.com.ar/images/beneficio.jpg' })
    imagenUrl: string;
}