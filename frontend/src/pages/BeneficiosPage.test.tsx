import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BeneficiosPage } from './BeneficiosPage';
import { useBeneficios } from '../hooks/useBeneficios';
import type { Beneficio } from '../types/beneficio.types';

vi.mock('../hooks/useBeneficios');
vi.mock('../components/Header/Header', () => ({
    Header: () => <div data-testid="header">Header</div>,
}));
vi.mock('../components/SearchBox/SearchBox', () => ({
    SearchBox: ({ onSearch }: any) => (
        <div data-testid="search-box">
            <button onClick={() => onSearch('test', 'all')}>Search</button>
        </div>
    ),
}));
vi.mock('../components/BeneficiosList/BeneficiosList', () => ({
    BeneficiosList: ({ beneficios }: any) => (
        <div data-testid="beneficios-list">
            {beneficios.map((b: Beneficio) => (
                <div key={b.id}>{b.comercio}</div>
            ))}
        </div>
    ),
}));

const mockBeneficios: Beneficio[] = [
    {
        id: 1,
        comercio: 'Starbucks',
        descripcion: '15% descuento',
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
        descripcion: '20% descuento',
        categoria: 'DEPORTE',
        aclaracion: 'Excepto lanzamientos',
        tarjeta: false,
        efectivo: true,
        vencimiento: '2024-01-01',
        imagenUrl: 'https://example.com/image2.jpg',
    },
];

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('BeneficiosPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all main components', () => {
        (useBeneficios as any).mockReturnValue({
            data: mockBeneficios,
            isLoading: false,
            error: null,
        });

        renderWithRouter(<BeneficiosPage />);

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('search-box')).toBeInTheDocument();
        expect(screen.getByTestId('beneficios-list')).toBeInTheDocument();
    });

    it('passes beneficios to BeneficiosList', () => {
        (useBeneficios as any).mockReturnValue({
            data: mockBeneficios,
            isLoading: false,
            error: null,
        });

        renderWithRouter(<BeneficiosPage />);

        expect(screen.getByText('Starbucks')).toBeInTheDocument();
        expect(screen.getByText('Nike')).toBeInTheDocument();
    });

    it('filters beneficios by search term', () => {
        (useBeneficios as any).mockReturnValue({
            data: mockBeneficios,
            isLoading: false,
            error: null,
        });

        renderWithRouter(<BeneficiosPage />);

        const searchButton = screen.getByText('Search');
        fireEvent.click(searchButton);

        // Component should still render
        expect(screen.getByTestId('beneficios-list')).toBeInTheDocument();
    });

    it('handles loading state', () => {
        (useBeneficios as any).mockReturnValue({
            data: undefined,
            isLoading: true,
            error: null,
        });

        renderWithRouter(<BeneficiosPage />);

        expect(screen.getByTestId('beneficios-list')).toBeInTheDocument();
    });

    it('handles error state', () => {
        (useBeneficios as any).mockReturnValue({
            data: undefined,
            isLoading: false,
            error: new Error('Failed to fetch'),
        });

        renderWithRouter(<BeneficiosPage />);

        const errorAlert = screen.getByRole('alert');
        expect(errorAlert).toBeInTheDocument();
        expect(errorAlert).toHaveTextContent('Error al cargar los beneficios');
        expect(screen.queryByTestId('beneficios-list')).not.toBeInTheDocument();
    });
});
