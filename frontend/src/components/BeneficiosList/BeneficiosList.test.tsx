import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BeneficiosList } from './BeneficiosList';
import { Beneficio } from '../../types/beneficio.types';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock Zustand store
vi.mock('../../store/favorites.store', () => ({
    useFavoritesStore: () => ({
        favorites: new Set(['1']),
        toggleFavorite: vi.fn(),
    }),
}));

const mockBeneficios: Beneficio[] = [
    {
        id: 1,
        comercio: 'Starbucks',
        descripcion: '15% descuento en cafés especiales',
        categoria: 'ALIMENTACION',
        aclaracion: 'Válido en locales selectos',
        tarjeta: false,
        efectivo: true,
        vencimiento: '2025-12-31',
        imagenUrl: 'https://example.com/image1.jpg',
    },
    {
        id: 2,
        comercio: 'Gimnasio FitClub',
        descripcion: '20% descuento en mensualidades',
        categoria: 'DEPORTE',
        aclaracion: 'Solo para nuevos socios',
        tarjeta: true,
        efectivo: false,
        vencimiento: '2025-08-20',
        imagenUrl: 'https://example.com/image2.jpg',
    },
];

describe('BeneficiosList', () => {
    const renderWithRouter = (ui: React.ReactElement) => {
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };

    it('renders loading skeletons when loading', () => {
        renderWithRouter(<BeneficiosList beneficios={[]} isLoading={true} />);

        const skeletonGrid = screen.getByLabelText(/cargando beneficios/i);
        expect(skeletonGrid).toBeInTheDocument();
        expect(skeletonGrid.querySelectorAll('.skeleton-card')).toHaveLength(12);
    });

    it('renders empty state when no beneficios', () => {
        renderWithRouter(<BeneficiosList beneficios={[]} isLoading={false} />);

        expect(screen.getByRole('status')).toHaveTextContent(/no se encontraron beneficios/i);
    });

    it('renders list of beneficios', () => {
        renderWithRouter(<BeneficiosList beneficios={mockBeneficios} isLoading={false} />);

        expect(screen.getByText('Starbucks')).toBeInTheDocument();
        expect(screen.getByText('Gimnasio FitClub')).toBeInTheDocument();
    });

    it('shows results count', () => {
        renderWithRouter(<BeneficiosList beneficios={mockBeneficios} isLoading={false} />);

        expect(screen.getByText(/mostrando 1 - 2 de 2 beneficios/i)).toBeInTheDocument();
    });

    it('navigates to detail when card is clicked', () => {
        renderWithRouter(<BeneficiosList beneficios={mockBeneficios} isLoading={false} />);

        const card = screen.getByLabelText('Starbucks');
        fireEvent.click(card);

        expect(mockNavigate).toHaveBeenCalledWith('/beneficios/1');
    });

    it('supports keyboard navigation', () => {
        renderWithRouter(<BeneficiosList beneficios={mockBeneficios} isLoading={false} />);

        const card = screen.getByLabelText('Starbucks');
        fireEvent.keyDown(card, { key: 'Enter' });

        expect(mockNavigate).toHaveBeenCalledWith('/beneficios/1');
    });

    it('marks inactive/expired beneficios', () => {
        renderWithRouter(<BeneficiosList beneficios={mockBeneficios} isLoading={false} />);

        const inactiveCard = screen.getByLabelText('Gimnasio FitClub');
        expect(inactiveCard).toBeInTheDocument();
        expect(inactiveCard).toHaveTextContent(/vencido/i);
    });

    it('displays pagination when more than 12 items', () => {
        const manyBeneficios: Beneficio[] = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            comercio: `Comercio ${i}`,
            descripcion: `Descripción ${i}`,
            categoria: 'DEPORTE',
            aclaracion: 'Aclaración',
            tarjeta: true,
            efectivo: false,
            vencimiento: '2025-12-31',
            imagenUrl: 'https://example.com/image.jpg',
        }));

        renderWithRouter(<BeneficiosList beneficios={manyBeneficios} isLoading={false} />);

        expect(screen.getByLabelText(/navegación de páginas/i)).toBeInTheDocument();
        expect(screen.getByText(/página 1 de 2/i)).toBeInTheDocument();
    });

    it('changes page when pagination buttons are clicked', () => {
        const manyBeneficios: Beneficio[] = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            comercio: `Comercio ${i}`,
            descripcion: `Descripción ${i}`,
            categoria: 'DEPORTE',
            aclaracion: 'Aclaración',
            tarjeta: true,
            efectivo: false,
            vencimiento: '2025-12-31',
            imagenUrl: 'https://example.com/image.jpg',
        }));

        renderWithRouter(<BeneficiosList beneficios={manyBeneficios} isLoading={false} />);

        const nextButton = screen.getByLabelText(/página siguiente/i);
        fireEvent.click(nextButton);

        expect(screen.getByText(/mostrando 13 - 15 de 15 beneficios/i)).toBeInTheDocument();
    });

    it('renders images with lazy loading', () => {
        renderWithRouter(<BeneficiosList beneficios={mockBeneficios} isLoading={false} />);

        const images = screen.getAllByRole('img');
        images.forEach(img => {
            expect(img).toHaveAttribute('loading', 'lazy');
        });
    });

    it('is accessible with proper ARIA attributes', () => {
        renderWithRouter(<BeneficiosList beneficios={mockBeneficios} isLoading={false} />);

        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText(/mostrando 1 - 2 de 2 beneficios/i)).toBeInTheDocument();
    });
});
