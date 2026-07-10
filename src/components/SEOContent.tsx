import React from 'react';
import { useAppContext } from '../lib/i18n';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const SEOContent = () => {
  const { t } = useAppContext();
  
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6']; // emerald, amber, red, blue
  
  const data = [
    { name: t('chartHealth') || 'Seguro de Saúde', value: 7.3 },
    { name: t('chartPension') || 'Aposentadoria', value: 9.3 },
    { name: t('chartUnemp') || 'Desemprego', value: 1.3 },
    { name: t('chartCare') || 'Cuidados Especiais', value: 2.0 },
  ];
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 text-sm">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{payload[0].name}</p>
          <p className="text-emerald-600 dark:text-emerald-400 font-bold">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 px-4 md:px-0">
      {/* We use darker text defaults, so dark:prose-invert handles automatically the headings and p tags in typography plugin */}
      <article className="prose prose-slate dark:prose-invert prose-emerald lg:prose-lg mx-auto transition-colors duration-300">
        <h2>{t('seoTitle1')}</h2>
        <p dangerouslySetInnerHTML={{ __html: t('seoP1') }} />

        <h3>{t('seoTitle2')}</h3>
        <p dangerouslySetInnerHTML={{ __html: t('seoP2') }} />

        <h3>{t('seoTitle3')}</h3>
        <p dangerouslySetInnerHTML={{ __html: t('seoP3') }} />
        
        <div className="not-prose my-8 w-full max-w-lg mx-auto bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={80}
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value, entry, index) => <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <hr className="my-10 border-slate-200 dark:border-slate-700" />

        <h2>{t('faqTitle')}</h2>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{t('faq1Q')}</h4>
            <p className="text-slate-600 dark:text-slate-400 mt-2" dangerouslySetInnerHTML={{ __html: t('faq1A') }} />
          </div>
          <div>
             <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{t('faq2Q')}</h4>
             <p className="text-slate-600 dark:text-slate-400 mt-2" dangerouslySetInnerHTML={{ __html: t('faq2A') }} />
          </div>
          <div>
             <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{t('faq3Q')}</h4>
             <p className="text-slate-600 dark:text-slate-400 mt-2" dangerouslySetInnerHTML={{ __html: t('faq3A') }} />
          </div>
        </div>

      </article>
    </div>
  );
};
