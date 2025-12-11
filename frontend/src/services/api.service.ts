import axios, { AxiosInstance, AxiosError } from 'axios';
import { Beneficio } from '../types/beneficio.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
                return config;
            },
            (error) => {
                console.error('[API Request Error]', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => {
                console.log(`[API Response] ${response.status} ${response.config.url}`);
                return response;
            },
            (error: AxiosError) => {
                this.handleError(error);
                return Promise.reject(error);
            }
        );
    }

    private handleError(error: AxiosError): void {
        if (error.response) {
            console.error(`[API Error] ${error.response.status}:`, error.response.data);
        } else if (error.request) {
            console.error('[API Error] No response received');
        } else {
            console.error('[API Error]', error.message);
        }
    }

    async getAllBeneficios(): Promise<Beneficio[]> {
        try {
            const response = await this.client.get<Beneficio[]>('/api/beneficios');
            return response.data;
        } catch (error) {
            console.error('Error fetching beneficios:', error);
            throw error;
        }
    }

    async getBeneficioById(id: string): Promise<Beneficio> {
        try {
            const response = await this.client.get<Beneficio>(`/api/beneficios/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching beneficio ${id}:`, error);
            throw error;
        }
    }
}

export const apiService = new ApiService();
