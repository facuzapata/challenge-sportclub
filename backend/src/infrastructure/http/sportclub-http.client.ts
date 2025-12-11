import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { ExternalApiException } from '../../domain/exceptions/domain.exceptions';

@Injectable()
export class SportclubHttpClient {
    private readonly logger = new Logger(SportclubHttpClient.name);
    private readonly axiosInstance: AxiosInstance;

    constructor(private readonly configService: ConfigService) {
        const baseURL = this.configService.get<string>('SPORTCLUB_API_URL');
        const timeout = this.configService.get<number>('API_TIMEOUT', 10000);

        this.logger.log(`Initializing HTTP Client with baseURL: ${baseURL}, timeout: ${timeout}ms`);

        this.axiosInstance = axios.create({
            baseURL,
            timeout,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Sportclub-Backend/1.0',
            },
        });

        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            (config) => {
                this.logger.log(`Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
                return config;
            },
            (error) => {
                this.logger.error('Request error:', error);
                return Promise.reject(error);
            },
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response) => {
                this.logger.log(`Response: ${response.status} ${response.config.url}`);
                return response;
            },
            (error: AxiosError) => {
                this.handleError(error);
                return Promise.reject(error);
            },
        );
    }

    private handleError(error: AxiosError): void {
        this.logger.error(`Full error: ${JSON.stringify({
            code: error.code,
            message: error.message,
            hasResponse: !!error.response,
            hasRequest: !!error.request,
        })}`);

        if (error.code === 'ECONNABORTED') {
            this.logger.error('Request timeout exceeded');
            throw new ExternalApiException('Tiempo de espera agotado al conectar con la API externa');
        }

        if (error.response) {
            this.logger.error(
                `API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
            );
            throw new ExternalApiException(
                `Error de API externa: ${error.response.status} - ${error.response.statusText}`,
            );
        }

        if (error.request) {
            this.logger.error(`No response received from API. Error code: ${error.code}, Message: ${error.message}`);
            throw new ExternalApiException('No se recibió respuesta de la API externa');
        }

        this.logger.error(`Unexpected error: ${error.message}`);
        throw new ExternalApiException('Error inesperado al comunicarse con la API externa');
    }

    async get<T>(url: string): Promise<T> {
        try {
            const response = await this.axiosInstance.get<T>(url);
            return response.data;
        } catch (error) {
            if (error instanceof ExternalApiException) {
                throw error;
            }
            throw new ExternalApiException('Error al realizar la petición GET');
        }
    }
}
