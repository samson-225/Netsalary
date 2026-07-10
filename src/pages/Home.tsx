import React from 'react';
import { Calculator } from '../components/Calculator';
import { Comparison } from '../components/Comparison';
import { SEOContent } from '../components/SEOContent';

export const Home = () => {
  return (
    <div className="w-full flex flex-col pt-8 md:pt-12 px-4 md:px-8">
      <Calculator />

      <Comparison />

      <section id="impostos" className="w-full mt-16 p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-50">Entenda os Impostos (Steuern)</h2>
        <div className="space-y-4 text-slate-600 dark:text-slate-400">
          <p><strong>Lohnsteuer (Imposto de Renda):</strong> O principal imposto deduzido do seu salário, calculado de forma progressiva com base na sua classe de imposto.</p>
          <p><strong>Solidaritätszuschlag (Sobretaxa de Solidariedade):</strong> Atualmente aplicado apenas a rendas mais altas.</p>
          <p><strong>Kirchensteuer (Imposto da Igreja):</strong> Cobrado apenas de membros registrados de igrejas reconhecidas (geralmente 8% ou 9% sobre o Lohnsteuer).</p>
        </div>
      </section>

      <section id="estados" className="w-full mt-16 p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-50">Diferenças entre Estados (Bundesländer)</h2>
        <p className="text-slate-600 dark:text-slate-400">A principal diferença entre os estados na tributação do salário recai sobre o <strong>Kirchensteuer</strong>. Na Baviera e Baden-Württemberg a taxa é de 8%, enquanto no restante da Alemanha é de 9%.</p>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Além disso, no estado da Saxônia, as contribuições para o Seguro de Cuidados (Pflegeversicherung) possuem uma distribuição diferente entre empregador e empregado.</p>
      </section>

      <section id="blog" className="w-full mt-16 p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-50">Blog e Artigos</h2>
        <p className="text-slate-600 dark:text-slate-400">Últimas notícias, dicas financeiras e guias sobre carreira e tributação na Alemanha estarão disponíveis aqui em breve.</p>
      </section>

      <section id="faq" className="w-full mt-16">
        <SEOContent />
      </section>
    </div>
  );
};

