import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBox } from './SearchBox';

describe('SearchBox', () => {
    it('renders search input and filter', () => {
        const mockOnSearch = vi.fn();
        render(<SearchBox onSearch={mockOnSearch} />);

        expect(screen.getByPlaceholderText(/buscar beneficios/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/estado/i)).toBeInTheDocument();
    });

    it('calls onSearch when form is submitted', () => {
        const mockOnSearch = vi.fn();
        render(<SearchBox onSearch={mockOnSearch} />);

        const input = screen.getByPlaceholderText(/buscar beneficios/i);
        const button = screen.getByRole('button', { name: /buscar beneficios/i });

        fireEvent.change(input, { target: { value: 'deportes' } });
        fireEvent.click(button);

        expect(mockOnSearch).toHaveBeenCalledWith('deportes', 'all');
    });

    it('resets search when clear button is clicked', () => {
        const mockOnSearch = vi.fn();
        render(<SearchBox onSearch={mockOnSearch} />);

        const input = screen.getByPlaceholderText(/buscar beneficios/i) as HTMLInputElement;
        const clearButton = screen.getByRole('button', { name: /limpiar búsqueda/i });

        fireEvent.change(input, { target: { value: 'test' } });
        expect(input.value).toBe('test');

        fireEvent.click(clearButton);

        expect(input.value).toBe('');
        expect(mockOnSearch).toHaveBeenCalledWith('', 'all');
    });

    it('updates filter status when select changes', () => {
        const mockOnSearch = vi.fn();
        render(<SearchBox onSearch={mockOnSearch} />);

        const select = screen.getByLabelText(/filtrar por estado/i);
        const button = screen.getByRole('button', { name: /buscar beneficios/i });

        fireEvent.change(select, { target: { value: 'active' } });
        fireEvent.click(button);

        expect(mockOnSearch).toHaveBeenCalledWith('', 'active');
    });

    it('disables inputs when loading', () => {
        const mockOnSearch = vi.fn();
        render(<SearchBox onSearch={mockOnSearch} isLoading={true} />);

        const input = screen.getByPlaceholderText(/buscar beneficios/i);
        const select = screen.getByLabelText(/filtrar por estado/i);
        const buttons = screen.getAllByRole('button');
        const submitButton = buttons.find(btn => btn.textContent?.includes('Buscando'));
        const clearButton = screen.getByLabelText(/limpiar búsqueda/i);

        expect(input).toBeDisabled();
        expect(select).toBeDisabled();
        expect(submitButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
        expect(submitButton).toHaveTextContent(/buscando/i);
    });

    it('is accessible with proper ARIA labels', () => {
        const mockOnSearch = vi.fn();
        render(<SearchBox onSearch={mockOnSearch} />);

        const searchBox = screen.getByRole('search');
        expect(searchBox).toBeInTheDocument();

        const input = screen.getByLabelText(/buscar beneficios por nombre/i);
        expect(input).toBeInTheDocument();

        const select = screen.getByLabelText(/filtrar por estado del beneficio/i);
        expect(select).toBeInTheDocument();
    });
});
