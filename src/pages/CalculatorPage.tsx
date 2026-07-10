import React from 'react';
import { Calculator } from '../components/Calculator';
import { useAppContext } from '../lib/i18n';

export const CalculatorPage = () => {
  const { t } = useAppContext();

  return (
    <div className="w-full flex justify-center py-6 md:py-10">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
           <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-50 mb-3 tracking-tight">
             {t('navCalculator')}
           </h2>
           <p className="text-slate-600 dark:text-slate-400 font-medium">
             {t('calcPageSubtitle')}
           </p>
        </div>
        <Calculator />
      </div>
    </div>
  );
};
