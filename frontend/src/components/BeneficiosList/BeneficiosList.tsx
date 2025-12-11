import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Beneficio } from '../../types/beneficio.types';
import { useFavoritesStore } from '../../store/favorites.store';
import './BeneficiosList.css';

interface BeneficiosListProps {
    beneficios: Beneficio[];
    isLoading?: boolean;
}

const ITEMS_PER_PAGE = 12;

export const BeneficiosList = ({ beneficios, isLoading }: BeneficiosListProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const { favorites, toggleFavorite } = useFavoritesStore();

    const totalPages = Math.ceil(beneficios.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentBeneficios = useMemo(
        () => beneficios.slice(startIndex, endIndex),
        [beneficios, startIndex, endIndex]
    );

    const handleCardClick = (id: string) => {
        navigate(`/beneficios/${id}`);
    };

    const handleFavoriteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        toggleFavorite(id);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <div className="beneficios-list">
                <div className="skeleton-grid" aria-label="Cargando beneficios">
                    {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                        <div key={index} className="skeleton-card" aria-hidden="true">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-content">
                                <div className="skeleton-title"></div>
                                <div className="skeleton-text"></div>
                                <div className="skeleton-text short"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (beneficios.length === 0) {
        return (
            <div className="empty-state" role="status">
                <p>No se encontraron beneficios.</p>
            </div>
        );
    }

    return (
        <div className="beneficios-list">
            <div className="results-info" role="status" aria-live="polite">
                Mostrando {startIndex + 1} - {Math.min(endIndex, beneficios.length)} de {beneficios.length} beneficios
            </div>

            <div className="beneficios-grid" role="list">
                {currentBeneficios.map((beneficio) => {
                    const isFavorite = favorites.has(String(beneficio.id));

                    // Verificar si el beneficio está vencido (zona horaria Argentina UTC-3)
                    const now = new Date();
                    const vencimiento = beneficio.vencimiento ? new Date(beneficio.vencimiento) : null;
                    const isExpired = vencimiento ? vencimiento < now : false;

                    // Un beneficio está activo si tiene métodos de pago Y no está vencido
                    const isActive = (beneficio.tarjeta || beneficio.efectivo) && !isExpired;

                    return (
                        <article
                            key={beneficio.id}
                            className="beneficio-card"
                            onClick={() => handleCardClick(String(beneficio.id))}
                            role="listitem"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleCardClick(String(beneficio.id));
                                }
                            }}
                            aria-label={beneficio.comercio}
                        >
                            <div className="card-header">
                                <button
                                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                                    onClick={(e) => handleFavoriteClick(e, String(beneficio.id))}
                                    aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                    aria-pressed={isFavorite}
                                    tabIndex={0}
                                >
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill={isFavorite ? 'currentColor' : 'none'}
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        aria-hidden="true"
                                    >
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="card-image">
                                <img
                                    src={beneficio.imagenUrl || '/placeholder-image.jpg'}
                                    alt={`Imagen de ${beneficio.comercio}`}
                                    loading="lazy"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder-image.jpg';
                                        target.alt = 'Imagen no disponible';
                                    }}
                                />
                            </div>

                            <div className="card-content">
                                <h3 className="card-title">{beneficio.comercio}</h3>
                                <p className="card-description">{beneficio.descripcion}</p>
                                <div className="card-meta">
                                    <span className="card-category">
                                        {beneficio.categoria.charAt(0).toUpperCase() + beneficio.categoria.slice(1).toLowerCase()}
                                    </span>
                                    <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                                        {isActive ? 'Activo' : isExpired ? 'Vencido' : 'Inactivo'}
                                    </span>
                                </div>
                                <div className="card-footer">
                                    <div className="payment-methods">
                                        {beneficio.tarjeta && (
                                            <span className="payment-badge" title="Acepta tarjeta">💳 Tarjeta</span>
                                        )}
                                        {beneficio.efectivo && (
                                            <span className="payment-badge" title="Acepta efectivo">💵 Efectivo</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <nav className="pagination" aria-label="Navegación de páginas">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                        aria-label="Página anterior"
                    >
                        ← Anterior
                    </button>

                    <span className="pagination-info" aria-current="page">
                        Página {currentPage} de {totalPages}
                    </span>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                        aria-label="Página siguiente"
                    >
                        Siguiente →
                    </button>
                </nav>
            )}
        </div>
    );
};
