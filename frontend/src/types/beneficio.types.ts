export interface Beneficio {
    id: number;
    comercio: string;
    descripcion: string;
    aclaracion: string;
    tarjeta: boolean;
    efectivo: boolean;
    vencimiento: string;
    categoria: string;
    imagenUrl: string;
}

export interface BeneficiosResponse {
    beneficios: Beneficio[];
    total: number;
}

export interface ErrorResponse {
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
}
