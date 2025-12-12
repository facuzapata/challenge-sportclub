import axios, { AxiosInstance, AxiosError } from 'axios';
import { HttpClientPort } from '../../../domain/ports/output/http-client.port';
import { ExternalApiException } from '../../../domain/exceptions/domain.exceptions';

export class SportclubHttpClient implements HttpClientPort {
    private readonly axiosInstance: AxiosInstance;

    constructor(
        private readonly baseURL: string,
        private readonly timeout: number = 10000,
        private readonly logger?: { log: (msg: string) => void; error: (msg: string) => void }
    ) {
        if (this.logger) {
            this.logger.log(`Initializing HTTP Client with baseURL: ${baseURL}, timeout: ${timeout}ms`);
        }

        this.axiosInstance = axios.create({
            baseURL,
            timeout,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Sportclub-Backend/1.0',
            },
        });

        this.axiosInstance.interceptors.request.use(
            (config) => {
                if (this.logger) {
                    this.logger.log(`Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
                }
                return config;
            },
            (error) => {
                if (this.logger) {
                    this.logger.error('Request error: ' + error);
                }
                return Promise.reject(error);
            },
        );

        this.axiosInstance.interceptors.response.use(
            (response) => {
                if (this.logger) {
                    this.logger.log(`Response: ${response.status} ${response.config.url}`);
                }
                return response;
            },
            (error: AxiosError) => {
                this.handleError(error);
                return Promise.reject(error);
            },
        );
    }

    private handleError(error: AxiosError): void {
        if (this.logger) {
            this.logger.error(`Full error: ${JSON.stringify({
                code: error.code,
                message: error.message,
                hasResponse: !!error.response,
                hasRequest: !!error.request,
            })}`);
        }

        if (error.code === 'ECONNABORTED') {
            if (this.logger) {
                this.logger.error('Request timeout exceeded');
            }
            throw new ExternalApiException('Tiempo de espera agotado al conectar con la API externa');
        }

        if (error.response) {
            if (this.logger) {
                this.logger.error(
                    `API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
                );
            }
            throw new ExternalApiException(
                `Error de API externa: ${error.response.status} - ${error.response.statusText}`,
            );
        }

        if (error.request) {
            if (this.logger) {
                this.logger.error(`No response received from API. Error code: ${error.code}, Message: ${error.message}`);
            }
            throw new ExternalApiException('No se recibió respuesta de la API externa');
        }

        if (this.logger) {
            this.logger.error(`Unexpected error: ${error.message}`);
        }
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
