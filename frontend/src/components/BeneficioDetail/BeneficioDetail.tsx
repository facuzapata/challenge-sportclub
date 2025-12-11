import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBeneficio } from '../../hooks/useBeneficios';
import { useFavoritesStore } from '../../store/favorites.store';
import './BeneficioDetail.css';

export const BeneficioDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: beneficio, isLoading, error } = useBeneficio(id || '');
    const { favorites, toggleFavorite } = useFavoritesStore();

    const isFavorite = id ? favorites.has(id) : false;

    const handleFavoriteToggle = () => {
        if (id) {
            toggleFavorite(id);
        }
    };

    const handleGoBack = () => {
        navigate('/beneficios');
    };

    if (isLoading) {
        return (
            <div className="beneficio-detail" role="main">
                <div className="skeleton-detail" aria-label="Cargando beneficio">
                    <div className="skeleton-image-large"></div>
                    <div className="skeleton-content-large">
                        <div className="skeleton-title-large"></div>
                        <div className="skeleton-text-large"></div>
                        <div className="skeleton-text-large"></div>
                        <div className="skeleton-text-large short"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="beneficio-detail" role="main">
                <div className="error-container" role="alert">
                    <h2>Error al cargar el beneficio</h2>
                    <p>{error instanceof Error ? error.message : 'Ocurrió un error inesperado'}</p>
                    <button onClick={handleGoBack} className="btn btn-primary">
                        Volver a la lista
                    </button>
                </div>
            </div>
        );
    }

    if (!beneficio) {
        return (
            <div className="beneficio-detail" role="main">
                <div className="error-container" role="alert">
                    <h2>Beneficio no encontrado</h2>
                    <p>El beneficio que buscas no existe o fue eliminado.</p>
                    <button onClick={handleGoBack} className="btn btn-primary">
                        Volver a la lista
                    </button>
                </div>
            </div>
        );
    }

    // Verificar si el beneficio está vencido (zona horaria Argentina UTC-3)
    const now = new Date();
    const vencimiento = beneficio.vencimiento ? new Date(beneficio.vencimiento) : null;
    const isExpired = vencimiento ? vencimiento < now : false;

    // Un beneficio está activo si tiene métodos de pago Y no está vencido
    const isActive = (beneficio.tarjeta || beneficio.efectivo) && !isExpired;

    return (
        <div className="beneficio-detail" role="main">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="breadcrumb">
                <ol>
                    <li>
                        <Link to="/beneficios">Beneficios</Link>
                    </li>
                    <li aria-current="page">{beneficio.comercio}</li>
                </ol>
            </nav>

            <div className="detail-container">
                {/* Image Section */}
                <div className="detail-image-section">
                    <img
                        src={beneficio.imagenUrl || '/placeholder-image.jpg'}
                        alt={`Imagen de ${beneficio.comercio}`}
                        className="detail-image"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                            target.alt = 'Imagen no disponible';
                        }}
                    />
                </div>

                {/* Content Section */}
                <div className="detail-content">
                    <div className="detail-header">
                        <h1 className="detail-title">{beneficio.comercio}</h1>
                        <button
                            className={`favorite-btn-large ${isFavorite ? 'active' : ''}`}
                            onClick={handleFavoriteToggle}
                            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            aria-pressed={isFavorite}
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill={isFavorite ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <span className="visually-hidden">
                                {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            </span>
                        </button>
                    </div>

                    <div className="detail-meta">
                        <span className="meta-category" aria-label="Categoría">
                            📂 {beneficio.categoria.charAt(0).toUpperCase() + beneficio.categoria.slice(1).toLowerCase()}
                        </span>
                        <span className={`meta-status ${isActive ? 'active' : 'inactive'}`} aria-label="Estado">
                            {isActive ? '✓ Activo' : isExpired ? '✗ Vencido' : '✗ Inactivo'}
                        </span>
                    </div>

                    <div className="detail-payment-methods">
                        <h3>Métodos de pago aceptados:</h3>
                        <div className="payment-options">
                            {beneficio.tarjeta && (
                                <span className="payment-option">💳 Tarjeta</span>
                            )}
                            {beneficio.efectivo && (
                                <span className="payment-option">💵 Efectivo</span>
                            )}
                            {!beneficio.tarjeta && !beneficio.efectivo && (
                                <span className="payment-option-none">No disponible</span>
                            )}
                        </div>
                    </div>

                    <div className="detail-description">
                        <h2>Descripción</h2>
                        <p>{beneficio.descripcion}</p>
                    </div>

                    {beneficio.aclaracion && (
                        <div className="detail-terms">
                            <h2>Aclaraciones</h2>
                            <p>{beneficio.aclaracion}</p>
                        </div>
                    )}

                    {beneficio.vencimiento && (
                        <div className="detail-expiration">
                            <h2>Fecha de Vencimiento</h2>
                            <p className="expiration-date">
                                📅 {new Date(beneficio.vencimiento).toLocaleDateString('es-AR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    )}

                    <div className="detail-actions">
                        <button onClick={handleGoBack} className="btn btn-secondary">
                            ← Volver a la lista
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
