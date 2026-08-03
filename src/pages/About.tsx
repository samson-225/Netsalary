import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppContext } from '../lib/i18n';

export const About = () => {
  const { t } = useAppContext();

  return (
    <div className="w-full max-w-3xl mx-auto py-12 md:py-20 px-4">
      <Helmet>
        <title>Sobre Nós | Calculadora de Salário Líquido na Alemanha</title>
        <meta name="description" content="Saiba mais sobre a nossa Calculadora de Salário Líquido na Alemanha. Somos uma ferramenta gratuita focada em ajudar profissionais e estudantes a entenderem seus rendimentos reais." />
      </Helmet>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 mb-6 tracking-tight">
          {t('navAbout')}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium">
          {t('aboutSubtitle')}
        </p>
      </div>

      <article className="prose prose-slate dark:prose-invert prose-lg mx-auto bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2>{t('aboutH2_1')}</h2>
        <p dangerouslySetInnerHTML={{ __html: t('aboutP1') }} />
        
        <h3>{t('aboutH2_2')}</h3>
        <p>
          {t('aboutP2')}
        </p>

        <h3>{t('aboutH2_3')}</h3>
        <p>
          {t('aboutP3')}
        </p>
      </article>
    </div>
  );
};
