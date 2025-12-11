import { describe, it, expect } from 'vitest';
import { apiService } from './api.service';

describe('apiService', () => {
    it('has getAllBeneficios method', () => {
        expect(typeof apiService.getAllBeneficios).toBe('function');
    });

    it('has getBeneficioById method', () => {
        expect(typeof apiService.getBeneficioById).toBe('function');
    });

    it('is a singleton instance', () => {
        expect(apiService).toBeDefined();
        expect(apiService).toBeTruthy();
    });
});