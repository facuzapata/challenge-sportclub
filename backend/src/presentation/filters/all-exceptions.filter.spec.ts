import { Test, TestingModule } from '@nestjs/testing';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';

describe('AllExceptionsFilter', () => {
    let filter: AllExceptionsFilter;
    let mockResponse: any;
    let mockRequest: any;
    let mockArgumentsHost: ArgumentsHost;

    beforeEach(async () => {
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        mockRequest = {
            url: '/test-url',
            method: 'GET',
        };

        mockArgumentsHost = {
            switchToHttp: jest.fn().mockReturnValue({
                getResponse: () => mockResponse,
                getRequest: () => mockRequest,
            }),
            getArgs: jest.fn(),
            getArgByIndex: jest.fn(),
            switchToRpc: jest.fn(),
            switchToWs: jest.fn(),
            getType: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [AllExceptionsFilter],
        }).compile();

        filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
    });

    it('should be defined', () => {
        expect(filter).toBeDefined();
    });

    it('should handle HttpException correctly', () => {
        const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

        filter.catch(exception, mockArgumentsHost);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Test error',
                path: '/test-url',
            }),
        );
    });

    it('should handle HttpException with object response', () => {
        const exception = new HttpException(
            { message: 'Custom error', error: 'Bad Request' },
            HttpStatus.BAD_REQUEST,
        );

        filter.catch(exception, mockArgumentsHost);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Custom error',
                path: '/test-url',
            }),
        );
    });

    it('should handle generic Error', () => {
        const exception = new Error('Generic error');

        filter.catch(exception, mockArgumentsHost);

        expect(mockResponse.status).toHaveBeenCalledWith(
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Generic error',
                path: '/test-url',
            }),
        );
    });

    it('should handle unknown exception', () => {
        const exception = 'String error';

        filter.catch(exception, mockArgumentsHost);

        expect(mockResponse.status).toHaveBeenCalledWith(
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                path: '/test-url',
            }),
        );
    });

    it('should include timestamp in response', () => {
        const exception = new HttpException('Test', HttpStatus.BAD_REQUEST);

        filter.catch(exception, mockArgumentsHost);

        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                timestamp: expect.any(String),
            }),
        );
    });
});
