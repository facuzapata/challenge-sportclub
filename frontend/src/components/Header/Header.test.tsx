import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header', () => {
    it('renders the Sportclub logo/brand', () => {
        renderWithRouter(<Header />);

        const logo = screen.getByAltText(/sportclub/i);
        expect(logo).toBeInTheDocument();
    });

    it('has navigation link to home/beneficios', () => {
        renderWithRouter(<Header />);

        const logo = screen.getByAltText(/sportclub/i);
        const navBrand = logo.closest('.navbar-brand');
        expect(navBrand).toBeInTheDocument();
    });

    it('does not render search input (search is in dedicated SearchBox)', () => {
        renderWithRouter(<Header />);

        expect(screen.queryByPlaceholderText(/buscar beneficios/i)).not.toBeInTheDocument();
    });

    it('does not have search button (search is in dedicated SearchBox)', () => {
        renderWithRouter(<Header />);

        expect(screen.queryByRole('button', { name: /buscar/i })).not.toBeInTheDocument();
    });

    it('is accessible with proper semantic HTML', () => {
        const { container } = renderWithRouter(<Header />);

        const nav = container.querySelector('nav');
        expect(nav).toBeInTheDocument();
    });

    it('uses Bootstrap components for styling', () => {
        const { container } = renderWithRouter(<Header />);

        // Bootstrap adds specific classes
        expect(container.querySelector('.navbar')).toBeInTheDocument();
    });
});
