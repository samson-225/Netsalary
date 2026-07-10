import React, { useState, useRef } from 'react';
import { Calculator as CalcIcon, Download, CheckCircle, Star, Info, Share2, FileText, Lock, Calendar, Clock, ArrowRight, ShieldAlert, Euro } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cn } from '../lib/utils';
import { PaymentPeriod, TaxClass, HealthInsurance, CalculationResult, states, calculateNet } from '../lib/salary';
import { useAppContext } from '../lib/i18n';

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
      {/* Hero and Form Section */}
      <div className="flex flex-col xl:flex-row gap-12 lg:gap-16 items-start mb-16">
        
        {/* Left: Hero Text */}
        <div className="flex-1 max-w-2xl mt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold text-sm mb-6 border border-blue-100 dark:border-blue-800/50">
            <span className="text-blue-500">✨</span>
            100% Gratuito • Preciso • Atualizado para {new Date().getFullYear()}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-50 mb-6 tracking-tight leading-[1.1]">
            {t('heroTitle')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 leading-relaxed">
            {t('heroDesc')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div>
               <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 mb-1">
                 <ShieldAlert className="w-5 h-5 text-blue-600" /> Seguro
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400">Seus dados estão protegidos</p>
            </div>
            <div>
               <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 mb-1">
                 <Clock className="w-5 h-5 text-blue-600" /> Rápido
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400">Resultado em segundos</p>
            </div>
            <div>
               <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 mb-1">
                 <CheckCircle className="w-5 h-5 text-blue-600" /> Preciso
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400">Cálculos atualizados para 2024</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 max-w-sm">
            <div className="flex text-amber-400">
               <Star className="w-5 h-5 fill-current" />
               <Star className="w-5 h-5 fill-current" />
               <Star className="w-5 h-5 fill-current" />
               <Star className="w-5 h-5 fill-current" />
               <Star className="w-5 h-5 fill-current" />
            </div>
            <div className="text-sm">
              <span className="font-bold text-slate-900 dark:text-slate-100">4.9/5</span>
              <span className="text-slate-500 dark:text-slate-400 ml-1">Baseado em 2.500+ cálculos</span>
            </div>
          </div>
        </div>

        {/* Right: Form Card */}
        <div className="w-full xl:w-[480px] bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 shrink-0 relative z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6">{t('appTitle')}</h2>
          
          <form onSubmit={handleCalculate} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  {t('grossSalary')} (€) <Info className="w-3 h-3 text-slate-400" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-slate-100"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                </div>
              </div>
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('period')}</label>
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                  <button type="button" onClick={() => setPeriod('hour')} className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", period === 'hour' ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-400")}>{t('hourly')}</button>
                  <button type="button" onClick={() => setPeriod('month')} className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", period === 'month' ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400")}>{t('monthly')}</button>
                  <button type="button" onClick={() => setPeriod('year')} className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", period === 'year' ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-400")}>{t('yearly')}</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">{t('taxClass')} <Info className="w-3 h-3 text-slate-400" /></label>
                <select value={taxClass} onChange={(e) => setTaxClass(e.target.value as TaxClass)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none text-slate-700 dark:text-slate-300">
                  <option value="I">{t('taxClass1')}</option>
                  <option value="II">{t('taxClass2')}</option>
                  <option value="III">{t('taxClass3')}</option>
                  <option value="IV">{t('taxClass4')}</option>
                  <option value="V">{t('taxClass5')}</option>
                  <option value="VI">{t('taxClass6')}</option>
                </select>
              </div>
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">{t('state')} <Info className="w-3 h-3 text-slate-400" /></label>
                <select value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none text-slate-700 dark:text-slate-300">
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('maritalStatus')}</label>
                <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value as 'single'|'married')} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none text-slate-700 dark:text-slate-300">
                  <option value="single">{t('single')}</option>
                  <option value="married">{t('married')}</option>
                </select>
              </div>
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">{t('childrenLabel')} <Info className="w-3 h-3 text-slate-400" /></label>
                <input type="number" min="0" value={children} onChange={(e) => setChildren(parseInt(e.target.value)||0)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none text-slate-900 dark:text-slate-100" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">{t('healthInsurance')} <Info className="w-3 h-3 text-slate-400" /></label>
                <select value={healthInsurance} onChange={(e) => setHealthInsurance(e.target.value as HealthInsurance)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none text-slate-700 dark:text-slate-300">
                  <option value="public">{t('public')}</option>
                  <option value="private">{t('private')}</option>
                </select>
              </div>
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">{t('churchTaxLabel')} <Info className="w-3 h-3 text-slate-400" /></label>
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                  <button type="button" onClick={() => setChurchTax(false)} className={cn("flex-1 py-1.5 text-sm font-medium rounded-md transition-colors", !churchTax ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400")}>{t('churchTaxNo')}</button>
                  <button type="button" onClick={() => setChurchTax(true)} className={cn("flex-1 py-1.5 text-sm font-medium rounded-md transition-colors", churchTax ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400")}>{t('churchTaxYes')}</button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 w-full sm:w-1/2 sm:pr-2.5">
               <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('ageLabel')}</label>
               <div className="relative flex items-center">
                 <input type="number" min="15" max="100" value={age} onChange={(e) => setAge(parseInt(e.target.value)||30)} className="w-full pl-3 pr-12 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none text-slate-900 dark:text-slate-100" />
                 <span className="absolute right-4 text-slate-400 text-sm">{t('ageYears')}</span>
               </div>
            </div>

            <button type="submit" className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2">
              {t('calculateBtn')} <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-center text-slate-500 flex items-center justify-center gap-1.5 mt-4">
              <Lock className="w-3 h-3" /> Seus dados não são armazenados ou compartilhados.
            </p>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div ref={resultsRef} className="w-full mb-16" id="resultado">
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{t('resultTitle')}</h2>
                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-800">{t('calcDone')}</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                <a href="#comparar" className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 rounded-lg text-sm font-semibold text-blue-700 dark:text-blue-400 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                  {t('compareBtn')}
                </a>
                <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <Share2 className="w-4 h-4" /> {t('shareBtn')}
                </button>
                <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <Download className="w-4 h-4" /> {t('downloadBtn')}
                </button>
              </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Euro className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                 </div>
                 <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">{t('grossSalary')}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatMoney(result.gross)}</p>
                 </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                 </div>
                 <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">{t('totalTax')}</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">{formatMoney(result.tax)}</p>
                 </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                 </div>
                 <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">{t('chartLabelPension')}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatMoney(result.breakdown.pension)}</p>
                 </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                 </div>
                 <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">{t('chartLabelHealth')}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatMoney(result.breakdown.health)}</p>
                 </div>
              </div>
            </div>

            {/* Bottom Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                 </div>
                 <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">{t('unemployment')}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatMoney(result.breakdown.unemployment)}</p>
                 </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                 </div>
                 <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">{t('careIns')}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatMoney(result.breakdown.care)}</p>
                 </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-green-500 shadow-md flex items-center gap-4 relative overflow-hidden lg:col-span-1">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 opacity-5 rounded-bl-full"></div>
                 <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                 </div>
                 <div>
                    <p className="text-xs text-green-700 dark:text-green-400 font-bold uppercase tracking-wide">{t('netSalary')}</p>
                    <p className="text-2xl font-extrabold text-green-600 dark:text-green-500">{formatMoney(result.net)}</p>
                 </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                 </div>
                 <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">{t('hourly')}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatMoney(result.hourlyRate)}</p>
                 </div>
              </div>
            </div>

            {/* Charts and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Pie Chart */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">{t('discountDetails')}</h3>
                 <div className="h-64 relative w-full flex-1">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={getChartData()} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={2} dataKey="value" stroke="none">
                         {getChartData().map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'][index % 6]} />
                         ))}
                       </Pie>
                       <Tooltip formatter={(value: number) => formatMoney(value)} />
                     </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-xs text-slate-400 font-medium">{t('totalDiscounts')}</span>
                     <span className="font-bold text-slate-900 dark:text-slate-100">{formatMoney(result.tax + result.social)}</span>
                   </div>
                 </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">{t('grossVsNet')}</h3>
                 <div className="h-64 flex-1">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={[{ name: 'Comparação', bruto: result.gross, liquido: result.net }]}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                       <XAxis dataKey="name" hide />
                       <YAxis tickFormatter={(val) => `€${Math.round(val/1000)}k`} width={45} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                       <Tooltip formatter={(value: number) => formatMoney(value)} cursor={{fill: 'transparent'}} />
                       <Bar dataKey="bruto" name={t('grossChart')} fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={80} />
                       <Bar dataKey="liquido" name={t('netChart')} fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={80} />
                       <Legend verticalAlign="bottom" height={36} wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
              </div>

              {/* Details Table */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t('discountDetails')}</h3>
                   <Info className="w-4 h-4 text-slate-400" />
                 </div>
                 <div className="flex-1 overflow-y-auto pr-2 space-y-3 text-sm">
                   <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                     <span className="text-slate-500 font-medium">{t('description')}</span>
                     <span className="text-slate-500 font-medium">{t('valueEur')}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-slate-700 dark:text-slate-300">{t('incomeTaxLabel')}</span>
                     <span className="font-semibold">{formatMoney(result.breakdown.incomeTax)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-slate-700 dark:text-slate-300">Solidaritätszuschlag</span>
                     <span className="font-semibold">{formatMoney(result.breakdown.soli)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-slate-700 dark:text-slate-300">Kirchensteuer</span>
                     <span className="font-semibold">{formatMoney(result.breakdown.church)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-slate-700 dark:text-slate-300">{t('chartLabelHealth')}</span>
                     <span className="font-semibold">{formatMoney(result.breakdown.health)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-slate-700 dark:text-slate-300">{t('unemployment')}</span>
                     <span className="font-semibold">{formatMoney(result.breakdown.unemployment)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-slate-700 dark:text-slate-300">{t('chartLabelPension')}</span>
                     <span className="font-semibold">{formatMoney(result.breakdown.pension)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-slate-700 dark:text-slate-300">{t('careIns')}</span>
                     <span className="font-semibold">{formatMoney(result.breakdown.care)}</span>
                   </div>
                   
                   <div className="flex justify-between pt-3 mt-3 border-t border-slate-200 dark:border-slate-700">
                     <span className="font-bold text-red-600 dark:text-red-400">{t('totalDiscounts')}</span>
                     <span className="font-bold text-red-600 dark:text-red-400">{formatMoney(result.tax + result.social)}</span>
                   </div>
                   <div className="flex justify-between pt-2">
                     <span className="font-bold text-green-600 dark:text-green-500">{t('netSalary')}</span>
                     <span className="font-bold text-green-600 dark:text-green-500">{formatMoney(result.net)}</span>
                   </div>
                 </div>
              </div>

            </div>

            {/* Bottom info banners */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
               <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                 <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                   <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                 </div>
                 <div>
                   <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t('banner1Title')}</p>
                   <p className="text-xs text-slate-500">{t('banner1Desc')}</p>
                 </div>
               </div>
               <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                 <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                   <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                 </div>
                 <div>
                   <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t('banner2Title')}</p>
                   <p className="text-xs text-slate-500">{t('banner2Desc')}</p>
                 </div>
               </div>
               <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                 <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                   <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                 </div>
                 <div>
                   <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t('banner3Title')}</p>
                   <p className="text-xs text-slate-500">{t('banner3Desc')}</p>
                 </div>
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
