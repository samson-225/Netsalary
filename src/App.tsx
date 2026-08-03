import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Admin } from './pages/Admin';
import { ComparePage } from './pages/ComparePage';
import { TaxesPage } from './pages/TaxesPage';
import { FAQPage } from './pages/FAQPage';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="calculator" element={<Navigate to="/" replace />} />
            <Route path="comparar" element={<ComparePage />} />
            <Route path="impostos" element={<TaxesPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="about" element={<About />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

