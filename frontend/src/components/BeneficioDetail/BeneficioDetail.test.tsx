import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useParams } from 'react-router-dom';
import { BeneficioDetail } from './BeneficioDetail';
import { useBeneficio } from '../../hooks/useBeneficios';
import { useFavoritesStore } from '../../store/favorites.store';
import type { Beneficio } from '../../types/beneficio.types';

// Mock hooks
vi.mock('../../hooks/useBeneficios');
vi.mock('../../store/favorites.store');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: vi.fn(),
    };
});

const mockBeneficio: Beneficio = {
    id: 1,
    comercio: 'Starbucks',
    descripcion: '15% descuento en cafés especiales',
    categoria: 'ALIMENTACION',
    aclaracion: 'Válido en locales selectos de CABA',
    tarjeta: true,
    efectivo: true,
    vencimiento: '2025-12-31',
    imagenUrl: 'https://example.com/starbucks.jpg',
};

const mockExpiredBeneficio: Beneficio = {
    ...mockBeneficio,
    id: 2,
    vencimiento: '2024-01-01',
};

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('BeneficioDetail', () => {
    const mockAddFavorite = vi.fn();
    const mockRemoveFavorite = vi.fn();
    const mockToggleFavorite = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useParams as any).mockReturnValue({ id: '1' });
        (useFavoritesStore as any).mockReturnValue({
            favorites: new Set<string>(),
            addFavorite: mockAddFavorite,
            removeFavorite: mockRemoveFavorite,
            toggleFavorite: mockToggleFavorite,
            isFavorite: vi.fn(() => false),
        });
    });

    it('shows loading state', () => {
        (useBeneficio as any).mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
        });

        renderWithRouter(<BeneficioDetail />);

        expect(screen.getByLabelText(/cargando beneficio/i)).toBeInTheDocument();
    });

    it('shows error state', () => {
        (useBeneficio as any).mockReturnValue({
            data: null,
            isLoading: false,
            error: new Error('Error al cargar'),
        });

        renderWithRouter(<BeneficioDetail />);

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/error al cargar el beneficio/i)).toBeInTheDocument();
    });

    it('renders beneficio details correctly', () => {
        (useBeneficio as any).mockReturnValue({
            data: mockBeneficio,
            isLoading: false,
            error: null,
        });

        renderWithRouter(<BeneficioDetail />);

        expect(screen.getByRole('heading', { name: 'Starbucks' })).toBeInTheDocument();
        expect(screen.getByText('15% descuento en cafés especiales')).toBeInTheDocument();
        expect(screen.getByText(/alimentacion/i)).toBeInTheDocument();
        expect(screen.getByText('Válido en locales selectos de CABA')).toBeInTheDocument();
        expect(screen.getByText(/30 de diciembre de 2025/i)).toBeInTheDocument();
    });

    it('displays active status for valid beneficio', () => {
        (useBeneficio as any).mockReturnValue({
            data: mockBeneficio,
            isLoading: false,
            error: null,
        });

        renderWithRouter(<BeneficioDetail />);

        expect(screen.getByText(/activo/i)).toBeInTheDocument();
        expect(screen.queryByText(/vencido/i)).not.toBeInTheDocument();
    });

    it('displays expired status for past expiration date', () => {
        (useBeneficio as any).mockReturnValue({
            data: mockExpiredBeneficio,
            isLoading: false,
            error: null,
        });

        renderWithRouter(<BeneficioDetail />);

        expect(screen.getByText(/vencido/i)).toBeInTheDocument();
        expect(screen.queryByText(/activo/i)).not.toBeInTheDocument();
    });

    it('shows payment methods when available', () => {
        (useBeneficio as any).mockReturnValue({
            data: mockBeneficio,
            isLoading: false,
            error: null,
        });

        renderWithRouter(<BeneficioDetail />);

        expect(screen.getByText(/tarjeta/i)).toBeInTheDocument();
        expect(screen.getByText(/efectivo/i)).toBeInTheDocument();
    });

    it('shows only available payment methods', () => {
        const cardOnlyBeneficio = { ...mockBeneficio, efectivo: false };
        (useBeneficio as any).mockReturnValue({
            data: cardOnlyBeneficio,
            isLoading: false,
            error: null,
        });

        renderWithRouter(<BeneficioDetail />);

        expect(screen.getByText(/tarjeta/i)).toBeInTheDocument();
        expect(screen.queryByText(/efectivo/i)).not.toBeInTheDocument();
    });

    it('adds beneficio to favorites when heart button is clicked', () => {
        (useBeneficio as any).mockReturnValue({
            data: mockBeneficio,
            isLoading: false,
            error: null,
        });

        renderWithRouter(<BeneficioDetail />);

        const favoriteButton = screen.getByLabelText(/agregar a favoritos/i);
        fireEvent.click(favoriteButton);

        expect(mockToggleFavorite).toHaveBeenCalledWith('1');
    });

    it('removes beneficio from favorites when already favorited', () => {
        const mockIsFavorite = vi.fn(() => true);
        (useFavoritesStore as any).mockReturnValue({
            favorites: new Set(['1']),
            addFavorite: mockAddFavorite,
            removeFavorite: mockRemoveFavorite,
            toggleFavorite: mockToggleFavorite,
            isFavorite: mockIsFavorite,
        });

        (useBeneficio as any).mockReturnValue({
            data: mockBeneficio,
            isLoading: false,
            error: null,
        });

        renderWithRouter(<BeneficioDetail />);

        const favoriteButton = screen.getByLabelText(/quitar de favoritos/i);
        fireEvent.click(favoriteButton);

        expect(mockToggleFavorite).toHaveBeenCalledWith('1');
    });

    it('has back button that navigates to beneficios list', () => {
        (useBeneficio as any).mockReturnValue({
            data: mockBeneficio,
            isLoading: false,
            error: null,
        });

        renderWithRouter(<BeneficioDetail />);

        const backButton = screen.getByText(/volver a la lista/i);
        expect(backButton).toBeInTheDocument();
    });

    it('renders image with correct attributes', () => {
        (useBeneficio as any).mockReturnValue({
            data: mockBeneficio,
            isLoading: false,
            error: null,
        });

        renderWithRouter(<BeneficioDetail />);

        const image = screen.getByAltText(/imagen de starbucks/i);
        expect(image).toHaveAttribute('src', 'https://example.com/starbucks.jpg');
    });

    it('is accessible with proper semantic HTML', () => {
        (useBeneficio as any).mockReturnValue({
            data: mockBeneficio,
            isLoading: false,
            error: null,
        });

        const { container } = renderWithRouter(<BeneficioDetail />);

        expect(container.querySelector('[role="main"]')).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
        expect(screen.getByRole('link')).toBeInTheDocument();
    });
});
