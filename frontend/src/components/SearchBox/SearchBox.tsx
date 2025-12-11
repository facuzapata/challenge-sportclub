import { useState, FormEvent } from 'react';
import './SearchBox.css';

interface SearchBoxProps {
    onSearch: (query: string, filterStatus?: string) => void;
    isLoading?: boolean;
}

export const SearchBox = ({ onSearch, isLoading }: SearchBoxProps) => {
    const [query, setQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSearch(query, filterStatus);
    };

    const handleReset = () => {
        setQuery('');
        setFilterStatus('all');
        onSearch('', 'all');
    };

    return (
        <div className="search-box" role="search">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-group">
                    <label htmlFor="search-input" className="visually-hidden">
                        Buscar beneficios por nombre
                    </label>
                    <input
                        id="search-input"
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar beneficios..."
                        className="search-input"
                        aria-label="Buscar beneficios por nombre"
                        disabled={isLoading}
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="status-filter" className="filter-label">
                        Estado:
                    </label>
                    <select
                        id="status-filter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="status-filter"
                        aria-label="Filtrar por estado del beneficio"
                        disabled={isLoading}
                    >
                        <option value="all">Todos</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                    </select>
                </div>

                <div className="search-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                        aria-label="Buscar beneficios"
                    >
                        {isLoading ? 'Buscando...' : 'Buscar'}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="btn btn-secondary"
                        disabled={isLoading}
                        aria-label="Limpiar búsqueda"
                    >
                        Limpiar
                    </button>
                </div>
            </form>
        </div>
    );
};
