import { SportclubHttpClient } from './sportclub-http.client';
import { ExternalApiException } from '../../../domain/exceptions/domain.exceptions';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SportclubHttpClient', () => {
    let httpClient: SportclubHttpClient;
    let axiosInstance: any;
    let requestInterceptor: any;
    let responseInterceptor: any;

    beforeEach(() => {
        axiosInstance = {
            get: jest.fn(),
            interceptors: {
                request: {
                    use: jest.fn((successHandler, errorHandler) => {
                        requestInterceptor = { successHandler, errorHandler };
                    }),
                },
                response: {
                    use: jest.fn((successHandler, errorHandler) => {
                        responseInterceptor = { successHandler, errorHandler };
                    }),
                },
            },
        };

        mockedAxios.create = jest.fn().mockReturnValue(axiosInstance);

        const mockLogger = {
            log: jest.fn(),
            error: jest.fn(),
        };

        httpClient = new SportclubHttpClient('https://api.test.com', 5000, mockLogger);
    });

    it('should create axios instance with correct config', () => {
        expect(mockedAxios.create).toHaveBeenCalledWith({
            baseURL: 'https://api.test.com',
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Sportclub-Backend/1.0',
            },
        });
    });

    it('should create without logger', () => {
        const client = new SportclubHttpClient('https://api.test.com', 5000);
        expect(client).toBeDefined();
    });

    describe('interceptors', () => {
        it('should handle request success', () => {
            const config = { method: 'get', url: '/test' };
            const result = requestInterceptor.successHandler(config);
            expect(result).toEqual(config);
        });

        it('should handle request error', async () => {
            const error = new Error('Request error');
            await expect(requestInterceptor.errorHandler(error)).rejects.toThrow(error);
        });

        it('should handle response success', () => {
            const response = { status: 200, config: { url: '/test' } };
            const result = responseInterceptor.successHandler(response);
            expect(result).toEqual(response);
        });

        it('should handle timeout error', () => {
            const error: any = new Error('timeout');
            error.code = 'ECONNABORTED';
            error.response = undefined;
            error.request = undefined;

            expect(() => responseInterceptor.errorHandler(error)).toThrow(ExternalApiException);
            expect(() => responseInterceptor.errorHandler(error)).toThrow('Tiempo de espera agotado');
        });

        it('should handle API error with response', () => {
            const error: any = new Error('API Error');
            error.response = {
                status: 500,
                statusText: 'Internal Server Error',
                data: {},
            };

            expect(() => responseInterceptor.errorHandler(error)).toThrow(ExternalApiException);
            expect(() => responseInterceptor.errorHandler(error)).toThrow('Error de API externa: 500');
        });

        it('should handle network error without response', () => {
            const error: any = new Error('Network Error');
            error.request = {};
            error.response = undefined;

            expect(() => responseInterceptor.errorHandler(error)).toThrow(ExternalApiException);
            expect(() => responseInterceptor.errorHandler(error)).toThrow('No se recibió respuesta');
        });

        it('should handle unexpected error', () => {
            const error: any = new Error('Unexpected');
            error.response = undefined;
            error.request = undefined;

            expect(() => responseInterceptor.errorHandler(error)).toThrow(ExternalApiException);
        });

        it('should reject promise on error', async () => {
            const error: any = new Error('Test Error');
            error.response = { status: 400, statusText: 'Bad Request', data: {} };

            try {
                await responseInterceptor.errorHandler(error);
            } catch (e) {
                expect(e).toBeInstanceOf(ExternalApiException);
            }
        });
    });

    describe('get', () => {
        it('should successfully fetch data', async () => {
            const mockData = { test: 'data' };
            axiosInstance.get.mockResolvedValue({ data: mockData });

            const result = await httpClient.get('/test');

            expect(result).toEqual(mockData);
            expect(axiosInstance.get).toHaveBeenCalledWith('/test');
        });

        it('should handle ExternalApiException', async () => {
            axiosInstance.get.mockRejectedValue(new ExternalApiException('API Error'));

            await expect(httpClient.get('/test')).rejects.toThrow(ExternalApiException);
        });

        it('should handle generic error', async () => {
            axiosInstance.get.mockRejectedValue(new Error('Generic error'));

            await expect(httpClient.get('/test')).rejects.toThrow(ExternalApiException);
            await expect(httpClient.get('/test')).rejects.toThrow('Error al realizar la petición GET');
        });
    });
});
