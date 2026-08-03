import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator } from '../components/Calculator';

export const Home = () => {
  return (
    <div className="w-full flex flex-col pt-4 md:pt-8 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Helmet>
        <title>Calculadora de Salário Líquido na Alemanha | Calcule seu Brutto Netto</title>
        <meta name="description" content="Calcule seu salário líquido (Netto) na Alemanha de forma fácil e rápida. Descubra os descontos de impostos, seguro de saúde e previdência social do seu salário bruto (Brutto)." />
      </Helmet>
      <Calculator />
    </div>
  );
};

