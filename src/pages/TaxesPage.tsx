import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Map, Landmark } from 'lucide-react';

export const TaxesPage = () => {
  return (
    <div className="w-full flex flex-col pt-4 md:pt-12 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Helmet>
        <title>Entenda os Impostos (Steuern) na Alemanha | Guia de Deduções</title>
        <meta name="description" content="Entenda como funcionam os impostos na Alemanha: Lohnsteuer (Imposto de Renda), Solidaritätszuschlag, Kirchensteuer (Imposto da Igreja) e as diferenças entre os estados alemães." />
      </Helmet>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="p-10 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
             <Landmark className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-8 text-slate-900 dark:text-slate-50 tracking-tight">Entenda os Impostos (Steuern)</h1>
          <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            <div>
              <strong className="text-slate-900 dark:text-slate-200 block mb-1">Lohnsteuer (Imposto de Renda)</strong>
              <p>O principal imposto deduzido do seu salário, calculado de forma progressiva com base na sua classe de imposto.</p>
            </div>
            <div>
              <strong className="text-slate-900 dark:text-slate-200 block mb-1">Solidaritätszuschlag (Sobretaxa)</strong>
              <p>Atualmente aplicado apenas a rendas mais altas (acima da média).</p>
            </div>
            <div>
              <strong className="text-slate-900 dark:text-slate-200 block mb-1">Kirchensteuer (Imposto da Igreja)</strong>
              <p>Cobrado apenas de membros registrados de igrejas reconhecidas (geralmente 8% ou 9% sobre o Lohnsteuer).</p>
            </div>
          </div>
        </section>

        <section className="p-10 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all flex flex-col">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
             <Map className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-8 text-slate-900 dark:text-slate-50 tracking-tight">Diferenças entre Estados</h2>
          <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-lg flex-1">
            <p>A principal diferença entre os estados na tributação do salário recai sobre o <strong>Kirchensteuer</strong>. Na Baviera e Baden-Württemberg a taxa é de 8%, enquanto no restante da Alemanha é de 9%.</p>
            <p>Além disso, no estado da Saxônia, as contribuições para o Seguro de Cuidados (Pflegeversicherung) possuem uma distribuição diferente entre empregador e empregado.</p>
          </div>
        </section>
      </div>
    </div>
  );
};
