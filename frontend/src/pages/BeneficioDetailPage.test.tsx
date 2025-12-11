import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BeneficioDetailPage } from './BeneficioDetailPage';

vi.mock('../components/Header/Header', () => ({
    Header: () => <div data-testid="header">Header</div>,
}));
vi.mock('../components/BeneficioDetail/BeneficioDetail', () => ({
    BeneficioDetail: () => <div data-testid="beneficio-detail">Detail</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('BeneficioDetailPage', () => {
    it('renders header and detail components', () => {
        renderWithRouter(<BeneficioDetailPage />);

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('beneficio-detail')).toBeInTheDocument();
    });

    it('has main semantic container', () => {
        renderWithRouter(<BeneficioDetailPage />);

        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
        expect(mainElement).toHaveAttribute('id', 'main-content');
    });
});
