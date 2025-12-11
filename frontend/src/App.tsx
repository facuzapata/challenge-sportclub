import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BeneficiosPage } from './pages/BeneficiosPage';
import { BeneficioDetailPage } from './pages/BeneficioDetailPage';
import './App.css';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Navigate to="/beneficios" replace />} />
                        <Route path="/beneficios" element={<BeneficiosPage />} />
                        <Route path="/beneficios/:id" element={<BeneficioDetailPage />} />
                    </Routes>
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
