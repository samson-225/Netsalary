import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Comparison } from '../components/Comparison';

export const ComparePage = () => {
  return (
    <div className="w-full flex flex-col pt-4 md:pt-8 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Helmet>
        <title>Comparar Salários Líquidos na Alemanha | Calculadora</title>
        <meta name="description" content="Compare diferentes propostas de emprego ou salários na Alemanha. Veja lado a lado o salário líquido, os impostos e as deduções sociais (Seguro Saúde, Previdência, etc)." />
      </Helmet>
      <Comparison />
    </div>
  );
};
