import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Form, Button, InputGroup } from 'react-bootstrap';
import './Header.css';

interface HeaderProps {
    onSearch?: (searchTerm: string) => void;
    showSearch?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, showSearch = false }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleLogoClick = () => {
        navigate('/beneficios');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    return (
        <Navbar bg="white" className="shadow-sm sticky-top py-3">
            <Container fluid className="px-4">
                <Navbar.Brand
                    onClick={handleLogoClick}
                    style={{ cursor: 'pointer' }}
                    aria-label="Ir a inicio"
                >
                    <img
                        src="/logo-sportclub.webp"
                        alt="SportClub"
                        height="40"
                        className="d-inline-block align-top w-25"
                    />
                </Navbar.Brand>

                {showSearch && (
                    <Form onSubmit={handleSearchSubmit} className="d-flex flex-row-reverse flex-grow-1 gap-3">
                        <InputGroup className="flex-grow-1  text-gray-900" style={{ maxWidth: '400px' }}>
                            <Form.Control
                                type="text"
                                placeholder="Buscar beneficio"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="border-end-0 border-black"
                                aria-label="Buscar beneficio"
                            />
                            <Button
                                variant="outline-secondary"
                                type="submit"
                                className="border-start-0 bg-white"
                            >
                                🔍
                            </Button>
                        </InputGroup>

                    </Form>
                )}
            </Container>
        </Navbar>
    );
};
