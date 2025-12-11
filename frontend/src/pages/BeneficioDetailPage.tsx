import { Header } from '../components/Header/Header';
import { BeneficioDetail } from '../components/BeneficioDetail/BeneficioDetail';
import './BeneficioDetailPage.css';

export const BeneficioDetailPage = () => {
    return (
        <div className="beneficio-detail-page">
            {/* Skip to main content link for accessibility */}
            <a href="#main-content" className="skip-link">
                Saltar al contenido principal
            </a>

            <Header showSearch={false} />

            <main id="main-content" className="page-content">
                <BeneficioDetail />
            </main>

            <footer className="page-footer">
                <p>&copy; 2024 Sportclub. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};
