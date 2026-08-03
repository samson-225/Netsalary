import React, { useState, useRef } from 'react';
import { Calculator as CalcIcon, Download, CheckCircle, Star, Info, Share2, FileText, Lock, Calendar, Clock, ArrowRight, ShieldAlert, Euro } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cn } from '../lib/utils';
import { PaymentPeriod, TaxClass, HealthInsurance, CalculationResult, states, calculateNet } from '../lib/salary';
import { useAppContext } from '../lib/i18n';

import { DashboardResults } from './DashboardResults';

export const Calculator = () => {
  const { t } = useAppContext();
  const [grossSalary, setGrossSalary] = useState<string>('4000');
  const [period, setPeriod] = useState<PaymentPeriod>('month');
  const [taxClass, setTaxClass] = useState<TaxClass>('I');
  const [maritalStatus, setMaritalStatus] = useState<'single'|'married'>('single');
  const [children, setChildren] = useState<number>(0);
  const [healthInsurance, setHealthInsurance] = useState<HealthInsurance>('public');
  const [stateRegion, setStateRegion] = useState<string>('Baviera');
  const [churchTax, setChurchTax] = useState<boolean>(false);
  const [age, setAge] = useState<number>(30);
  
  const [result, setResult] = useState<CalculationResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!grossSalary.trim()) return;
    const grossNum = parseFloat(grossSalary.replace(',', '.'));
    if (isNaN(grossNum) || grossNum <= 0) return;

    const res = calculateNet(grossNum, period, taxClass, children, healthInsurance, churchTax, stateRegion, age);
    setResult(res);
    
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const getChartData = () => {
    if (!result) return [];
    return [
      { name: 'Imposto de Renda', value: result.breakdown.incomeTax },
      { name: 'Seguro Saúde', value: result.breakdown.health },
      { name: 'Previdência', value: result.breakdown.pension },
      { name: 'Seguro Desemprego', value: result.breakdown.unemployment },
      { name: 'Seguro de Cuidados', value: result.breakdown.care },
      { name: 'Kirchensteuer', value: result.breakdown.church },
    ].filter(item => item.value > 0);
  };

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'EUR' }).format(val);
  };

  const handleShare = async () => {
    if (navigator.share && result) {
      try {
        await navigator.share({
          title: 'Meu Salário Líquido na Alemanha',
          text: `Calculei meu salário e meu líquido estimado é de ${formatMoney(result.net)} por ${period === 'month' ? 'mês' : period === 'year' ? 'ano' : 'hora'}.`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Compartilhamento cancelado ou falhou', err);
      }
    } else {
      alert('Compartilhamento não suportado neste navegador. Copie a URL da página!');
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const text = `
Resultado do Cálculo de Salário Líquido (Alemanha)
=================================================
Salário Bruto: ${formatMoney(result.gross)}
Salário Líquido: ${formatMoney(result.net)}

Detalhes dos Descontos:
- Imposto de Renda: ${formatMoney(result.breakdown.incomeTax)}
- Seguro Saúde: ${formatMoney(result.breakdown.health)}
- Previdência Social: ${formatMoney(result.breakdown.pension)}
- Seguro Desemprego: ${formatMoney(result.breakdown.unemployment)}
- Seguro de Cuidados (Pflege): ${formatMoney(result.breakdown.care)}
- Solidaritätszuschlag: ${formatMoney(result.breakdown.soli)}
- Kirchensteuer: ${formatMoney(result.breakdown.church)}

=================================================
Gerado por Calculadora de Salário Líquido
Data: ${new Date().toLocaleDateString()}
    `.trim();

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salario-liquido-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      {/* 1. Hero Section Forte no Topo */}
      <div className="flex flex-col items-center text-center pt-8 pb-16 px-4 print:hidden">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm mb-8 border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          Rápido, simples e atualizado para {new Date().getFullYear()}
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-slate-50 mb-6 tracking-tight leading-tight max-w-4xl">
          {t('heroTitle')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed">
          {t('heroDesc')} Descubra exatamente quanto vai cair na sua conta e entenda cada desconto de forma transparente.
        </p>

        {/* 2. Bloco Principal da Calculadora */}
        <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 md:p-10 relative z-10 text-left">
          <form onSubmit={handleCalculate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Salário Bruto */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  {t('grossSalary')} <Info className="w-4 h-4 text-slate-400" />
                </label>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all flex-1">
                    <span className="pl-6 text-slate-400 font-medium text-lg">€</span>
                    <input
                      type="number"
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(e.target.value)}
                      className="w-full pl-3 pr-6 py-4 bg-transparent outline-none text-slate-900 dark:text-slate-100 text-3xl font-bold placeholder-slate-300"
                      placeholder="Ex: 50000"
                    />
                  </div>
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-full lg:w-auto h-[68px]">
                    <button type="button" onClick={() => setPeriod('hour')} className={cn("flex-1 lg:px-6 py-2 text-sm font-semibold rounded-xl transition-colors", period === 'hour' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>{t('hourly')}</button>
                    <button type="button" onClick={() => setPeriod('month')} className={cn("flex-1 lg:px-6 py-2 text-sm font-semibold rounded-xl transition-colors", period === 'month' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>{t('monthly')}</button>
                    <button type="button" onClick={() => setPeriod('year')} className={cn("flex-1 lg:px-6 py-2 text-sm font-semibold rounded-xl transition-colors", period === 'year' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>{t('yearly')}</button>
                  </div>
                </div>
              </div>

              {/* Classe de Imposto & Estado */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('taxClass')}</label>
                  <select value={taxClass} onChange={(e) => setTaxClass(e.target.value as TaxClass)} className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-base outline-none text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                    <option value="I">{t('taxClass1')}</option>
                    <option value="II">{t('taxClass2')}</option>
                    <option value="III">{t('taxClass3')}</option>
                    <option value="IV">{t('taxClass4')}</option>
                    <option value="V">{t('taxClass5')}</option>
                    <option value="VI">{t('taxClass6')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('state')}</label>
                  <select value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-base outline-none text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Detalhes Adicionais */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('maritalStatus')}</label>
                    <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value as 'single'|'married')} className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-base outline-none text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                      <option value="single">{t('single')}</option>
                      <option value="married">{t('married')}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('childrenLabel')}</label>
                    <input type="number" min="0" value={children} onChange={(e) => setChildren(parseInt(e.target.value)||0)} className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-base outline-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('healthInsurance')}</label>
                    <select value={healthInsurance} onChange={(e) => setHealthInsurance(e.target.value as HealthInsurance)} className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-base outline-none text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                      <option value="public">{t('public')}</option>
                      <option value="private">{t('private')}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('churchTaxLabel')}</label>
                    <select value={churchTax ? 'yes' : 'no'} onChange={(e) => setChurchTax(e.target.value === 'yes')} className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-base outline-none text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                      <option value="no">{t('churchTaxNo')}</option>
                      <option value="yes">{t('churchTaxYes')}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Lock className="w-4 h-4" /> Seus dados não são armazenados.
              </div>
              <button type="submit" className="w-full md:w-auto px-10 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-slate-900/20 dark:shadow-blue-900/20 transition-all flex items-center justify-center gap-3">
                {t('calculateBtn')} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Área de Resultados */}
      <div ref={resultsRef} className="w-full max-w-6xl mx-auto mb-20 px-4" id="resultado">
        {result && (
          <div className="animate-fade-in-up">
            <DashboardResults 
              result={result} 
              period={period} 
              onDownload={handleDownload}
              onShare={handleShare}
            />

            {/* Seção de Confiança */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
               <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-700/50">
                 <ShieldAlert className="w-8 h-8 text-blue-500 mb-4" />
                 <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Cálculo Transparente</h4>
                 <p className="text-sm text-slate-600 dark:text-slate-400">Fórmulas oficiais do Ministério das Finanças da Alemanha para garantir precisão.</p>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-700/50">
                 <CheckCircle className="w-8 h-8 text-emerald-500 mb-4" />
                 <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Atualizado {new Date().getFullYear()}</h4>
                 <p className="text-sm text-slate-600 dark:text-slate-400">Todas as taxas, limites e subsídios estão atualizados para o ano fiscal vigente.</p>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-700/50">
                 <Lock className="w-8 h-8 text-indigo-500 mb-4" />
                 <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">100% Privado</h4>
                 <p className="text-sm text-slate-600 dark:text-slate-400">Seus dados salariais nunca saem do seu dispositivo. Não guardamos informação.</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
