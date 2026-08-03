import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOContent } from '../components/SEOContent';

export const FAQPage = () => {
  return (
    <div className="w-full flex flex-col pt-4 md:pt-12 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Helmet>
        <title>Perguntas Frequentes (FAQ) - Calculadora de Salário Alemanha</title>
        <meta name="description" content="Tire todas as suas dúvidas sobre salários na Alemanha. O que são as classes de impostos (Steuerklassen)? O que é o Seguro de Saúde (Krankenversicherung)? Descubra tudo aqui." />
      </Helmet>
      <section className="w-full max-w-6xl mx-auto">
        <SEOContent />
      </section>
    </div>
  );
};
