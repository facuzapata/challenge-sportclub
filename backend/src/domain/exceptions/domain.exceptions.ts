export class BeneficioNotFoundException extends Error {
    constructor(id: string) {
        super(`Beneficio con ID ${id} no encontrado`);
        this.name = 'BeneficioNotFoundException';
    }
}

export class ExternalApiException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ExternalApiException';
    }
}

export class DataValidationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DataValidationException';
    }
}
