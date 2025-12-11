import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api.service';

export const useBeneficios = () => {
    return useQuery({
        queryKey: ['beneficios'],
        queryFn: () => apiService.getAllBeneficios(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });
};

export const useBeneficio = (id: string) => {
    return useQuery({
        queryKey: ['beneficio', id],
        queryFn: () => apiService.getBeneficioById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });
};
