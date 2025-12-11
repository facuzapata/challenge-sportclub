import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SportclubHttpClient } from './sportclub-http.client';
import { ExternalApiException } from '../../domain/exceptions/domain.exceptions';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SportclubHttpClient', () => {
    let httpClient: SportclubHttpClient;
    let configService: ConfigService;
    let requestInterceptor: any;
    let responseInterceptor: any;

    beforeEach(async () => {
        const mockConfigService = {
            get: jest.fn((key: string, defaultValue?: any) => {
                if (key === 'SPORTCLUB_API_URL') return 'https://api.test.com';
                if (key === 'API_TIMEOUT') return 5000;
                return defaultValue;
            }),
        };

        const axiosInstance = {
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

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SportclubHttpClient,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        httpClient = module.get<SportclubHttpClient>(SportclubHttpClient);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(httpClient).toBeDefined();
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

    describe('interceptors', () => {
        it('should handle request interceptor success', () => {
            const config = { method: 'get', url: '/test' };
            const result = requestInterceptor.successHandler(config);
            expect(result).toEqual(config);
        });

        it('should handle request interceptor error', () => {
            const error = new Error('Request error');
            expect(() => requestInterceptor.errorHandler(error)).rejects.toThrow(error);
        });

        it('should handle response interceptor success', () => {
            const response = { status: 200, config: { url: '/test' } };
            const result = responseInterceptor.successHandler(response);
            expect(result).toEqual(response);
        });

        it('should handle response interceptor error with timeout', () => {
            const error: any = new Error('timeout');
            error.code = 'ECONNABORTED';
            error.response = undefined;
            error.request = undefined;

            expect(() => responseInterceptor.errorHandler(error)).toThrow(ExternalApiException);
        });

        it('should handle response interceptor error with response', () => {
            const error: any = new Error('API Error');
            error.response = { status: 500, statusText: 'Internal Server Error', data: {} };

            expect(() => responseInterceptor.errorHandler(error)).toThrow(ExternalApiException);
        });

        it('should handle response interceptor error with request but no response', () => {
            const error: any = new Error('Network Error');
            error.request = {};
            error.response = undefined;

            expect(() => responseInterceptor.errorHandler(error)).toThrow(ExternalApiException);
        });

        it('should handle response interceptor unexpected error', () => {
            const error: any = new Error('Unexpected');
            error.response = undefined;
            error.request = undefined;

            expect(() => responseInterceptor.errorHandler(error)).toThrow(ExternalApiException);
        });
    });

    describe('get', () => {
        it('should return data on successful request', async () => {
            const mockData = { id: '1', name: 'Test' };
            const axiosInstance = mockedAxios.create() as any;
            axiosInstance.get.mockResolvedValue({ data: mockData });

            const result = await httpClient.get('/test');

            expect(result).toEqual(mockData);
        });

        it('should throw ExternalApiException on timeout', async () => {
            const axiosInstance = mockedAxios.create() as any;
            const timeoutError: any = new Error('timeout');
            timeoutError.code = 'ECONNABORTED';
            axiosInstance.get.mockRejectedValue(timeoutError);

            await expect(httpClient.get('/test')).rejects.toThrow(ExternalApiException);
        });

        it('should throw ExternalApiException when no response', async () => {
            const axiosInstance = mockedAxios.create() as any;
            const error: any = new Error('Network Error');
            error.request = {};
            axiosInstance.get.mockRejectedValue(error);

            await expect(httpClient.get('/test')).rejects.toThrow(ExternalApiException);
        });

        it('should throw ExternalApiException on API error response', async () => {
            const axiosInstance = mockedAxios.create() as any;
            const error: any = new Error('API Error');
            error.response = {
                status: 500,
                statusText: 'Internal Server Error',
                data: { message: 'Error' },
            };
            axiosInstance.get.mockRejectedValue(error);

            await expect(httpClient.get('/test')).rejects.toThrow(ExternalApiException);
        });

        it('should throw ExternalApiException on generic error', async () => {
            const axiosInstance = mockedAxios.create() as any;
            const error = new Error('Generic error');
            axiosInstance.get.mockRejectedValue(error);

            await expect(httpClient.get('/test')).rejects.toThrow(ExternalApiException);
        });
    });
});