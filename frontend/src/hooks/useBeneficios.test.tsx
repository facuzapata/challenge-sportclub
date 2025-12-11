import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBeneficios, useBeneficio } from './useBeneficios';
import { apiService } from '../services/api.service';
import type { Beneficio } from '../types/beneficio.types';
import { ReactNode } from 'react';

vi.mock('../services/api.service', () => ({
    apiService: {
        getAllBeneficios: vi.fn(),
        getBeneficioById: vi.fn(),
    },
}));

const mockBeneficios: Beneficio[] = [
    {
        id: 1,
        comercio: 'Starbucks',
        descripcion: '15% descuento en cafés',
        categoria: 'ALIMENTACION',
        aclaracion: 'Válido en CABA',
        tarjeta: true,
        efectivo: false,
        vencimiento: '2025-12-31',
        imagenUrl: 'https://example.com/image1.jpg',
    },
    {
        id: 2,
        comercio: 'Nike',
        descripcion: '20% en zapatillas',
        categoria: 'DEPORTE',
        aclaracion: 'Excepto lanzamientos',
        tarjeta: false,
        efectivo: true,
        vencimiento: '2025-06-30',
        imagenUrl: 'https://example.com/image2.jpg',
    },
];

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useBeneficios', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches and returns all beneficios', async () => {
        vi.mocked(apiService.getAllBeneficios).mockResolvedValue(mockBeneficios);

        const { result } = renderHook(() => useBeneficios(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockBeneficios);
        expect(apiService.getAllBeneficios).toHaveBeenCalledTimes(1);
    });

    it('handles loading state', () => {
        vi.mocked(apiService.getAllBeneficios).mockImplementation(
            () => new Promise(() => { }) // Never resolves
        );

        const { result } = renderHook(() => useBeneficios(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBeUndefined();
    });

    it('caches data with React Query', async () => {
        vi.mocked(apiService.getAllBeneficios).mockResolvedValue(mockBeneficios);

        const wrapper = createWrapper();

        // First render
        const { result: result1 } = renderHook(() => useBeneficios(), { wrapper });
        await waitFor(() => expect(result1.current.isSuccess).toBe(true));

        // Second render should use cached data
        const { result: result2 } = renderHook(() => useBeneficios(), { wrapper });
        await waitFor(() => expect(result2.current.isSuccess).toBe(true));

        // API should only be called once due to caching
        expect(apiService.getAllBeneficios).toHaveBeenCalledTimes(1);
    });
});

describe('useBeneficio', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches and returns a single beneficio by id', async () => {
        const beneficio = mockBeneficios[0];
        vi.mocked(apiService.getBeneficioById).mockResolvedValue(beneficio);

        const { result } = renderHook(() => useBeneficio('1'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(beneficio);
        expect(apiService.getBeneficioById).toHaveBeenCalledWith('1');
    });

    it('handles loading state for single beneficio', () => {
        vi.mocked(apiService.getBeneficioById).mockImplementation(
            () => new Promise(() => { })
        );

        const { result } = renderHook(() => useBeneficio('1'), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBeUndefined();
    });

    it('caches individual beneficio data', async () => {
        const beneficio = mockBeneficios[0];
        vi.mocked(apiService.getBeneficioById).mockResolvedValue(beneficio);

        const wrapper = createWrapper();

        // First render
        const { result: result1 } = renderHook(() => useBeneficio('1'), { wrapper });
        await waitFor(() => expect(result1.current.isSuccess).toBe(true));

        // Second render should use cached data
        const { result: result2 } = renderHook(() => useBeneficio('1'), { wrapper });
        await waitFor(() => expect(result2.current.isSuccess).toBe(true));

        // API should only be called once
        expect(apiService.getBeneficioById).toHaveBeenCalledTimes(1);
    });

    it('handles different ids independently', async () => {
        vi.mocked(apiService.getBeneficioById)
            .mockResolvedValueOnce(mockBeneficios[0])
            .mockResolvedValueOnce(mockBeneficios[1]);

        const wrapper = createWrapper();

        const { result: result1 } = renderHook(() => useBeneficio('1'), { wrapper });
        const { result: result2 } = renderHook(() => useBeneficio('2'), { wrapper });

        await waitFor(() => {
            expect(result1.current.isSuccess).toBe(true);
            expect(result2.current.isSuccess).toBe(true);
        });

        expect(result1.current.data).toEqual(mockBeneficios[0]);
        expect(result2.current.data).toEqual(mockBeneficios[1]);
        expect(apiService.getBeneficioById).toHaveBeenCalledTimes(2);
    });
});
