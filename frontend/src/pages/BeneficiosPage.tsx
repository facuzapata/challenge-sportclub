import { useState, useMemo } from 'react';
import { Header } from '../components/Header/Header';
import { SearchBox } from '../components/SearchBox/SearchBox';
import { BeneficiosList } from '../components/BeneficiosList/BeneficiosList';
import { useBeneficios } from '../hooks/useBeneficios';
import './BeneficiosPage.css';

export const BeneficiosPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const { data, isLoading, error } = useBeneficios();

    // Filter beneficios based on search and status
    const filteredBeneficios = useMemo(() => {
        if (!data) return [];

        let filtered = data;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (beneficio) =>
                    beneficio.comercio.toLowerCase().includes(query) ||
                    beneficio.descripcion.toLowerCase().includes(query) ||
                    beneficio.categoria.toLowerCase().includes(query) ||
                    beneficio.aclaracion.toLowerCase().includes(query)
            );
        }

        // Filter by status (considering expiration date)
        if (filterStatus !== 'all') {
            const now = new Date();
            filtered = filtered.filter((beneficio) => {
                const vencimiento = beneficio.vencimiento ? new Date(beneficio.vencimiento) : null;
                const isExpired = vencimiento ? vencimiento < now : false;
                const isActive = (beneficio.tarjeta || beneficio.efectivo) && !isExpired;

                if (filterStatus === 'active') {
                    return isActive;
                } else if (filterStatus === 'inactive') {
                    return !isActive;
                }
                return true;
            });
        }

        return filtered;
    }, [data, searchQuery, filterStatus]);

    const handleSearch = (query: string, status?: string) => {
        setSearchQuery(query);
        if (status) {
            setFilterStatus(status);
        }
    };

    return (
        <div className="beneficios-page">
            <a href="#main-content" className="skip-link">
                Saltar al contenido principal
            </a>

            <Header showSearch={true} onSearch={setSearchQuery} />

            <main id="main-content" className="page-content">
                <div className="page-intro">
                    <h1 className="page-title">Beneficios Sportclub</h1>
                    <p className="page-subtitle">
                        Descubrí todos los beneficios que tenemos para vos
                    </p>
                </div>

                <SearchBox onSearch={handleSearch} isLoading={isLoading} />

                {error && (
                    <div className="error-message" role="alert">
                        <p>Error al cargar los beneficios: {error instanceof Error ? error.message : 'Error desconocido'}</p>
                    </div>
                )}

                {!error && (
                    <BeneficiosList
                        beneficios={filteredBeneficios}
                        isLoading={isLoading}
                    />
                )}
            </main>

            <footer className="page-footer">
                <p>&copy; 2024 Sportclub. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};
