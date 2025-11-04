import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Importa tu Header existente
import Footer from './Footer'; // Importa el Footer nuevo

function Layout() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                <Outlet /> 
            </main>
            <Footer />
        </div>
    );
}

export default Layout;