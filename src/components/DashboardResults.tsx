import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Download, Share2, Printer, Copy, 
  Wallet, Landmark, ShieldPlus, Umbrella, 
  HeartPulse, Building, PiggyBank, Receipt,
  ChevronDown, ArrowRight, CheckCircle2, TrendingUp, Info, Split
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { CalculationResult, PaymentPeriod } from '../lib/salary';
import { useAppContext } from '../lib/i18n';
import { CountUp } from './CountUp';
import { cn } from '../lib/utils';
import { TipOfTheDay } from './TipOfTheDay';

interface DashboardResultsProps {
  result: CalculationResult;
  period: PaymentPeriod;
  onDownload: () => void;
  onShare: () => void;
}

export const DashboardResults: React.FC<DashboardResultsProps> = ({ result, period, onDownload, onShare }) => {
  const { t } = useAppContext();
  const [showDetails, setShowDetails] = useState(false);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'EUR' }).format(val);
  };

  const calculatePercentage = (value: number) => {
    return ((value / result.gross) * 100).toFixed(1);
  };

  const getChartData = () => {
    return [
      { name: 'Salário Líquido', value: result.net, color: '#10b981' },
      { name: 'Impostos', value: result.tax, color: '#f43f5e' },
      { name: 'Contribuições Sociais', value: result.social, color: '#3b82f6' },
    ].filter(item => item.value > 0);
  };

  const detailsData = [
    { icon: <Landmark className="w-5 h-5 text-rose-500" />, name: 'Imposto de Renda', value: result.breakdown.incomeTax, color: 'bg-rose-500' },
    { icon: <HeartPulse className="w-5 h-5 text-blue-500" />, name: 'Seguro Saúde', value: result.breakdown.health, color: 'bg-blue-500' },
    { icon: <PiggyBank className="w-5 h-5 text-indigo-500" />, name: 'Previdência Social', value: result.breakdown.pension, color: 'bg-indigo-500' },
    { icon: <Umbrella className="w-5 h-5 text-sky-500" />, name: 'Seguro Desemprego', value: result.breakdown.unemployment, color: 'bg-sky-500' },
    { icon: <ShieldPlus className="w-5 h-5 text-teal-500" />, name: 'Seguro de Cuidados', value: result.breakdown.care, color: 'bg-teal-500' },
    { icon: <Building className="w-5 h-5 text-purple-500" />, name: 'Imposto da Igreja', value: result.breakdown.church, color: 'bg-purple-500' },
    { icon: <Receipt className="w-5 h-5 text-orange-500" />, name: 'Solidaritätszuschlag', value: result.breakdown.soli, color: 'bg-orange-500' },
  ].filter(item => item.value > 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Salário Bruto: ${formatMoney(result.gross)} -> Líquido: ${formatMoney(result.net)}`);
    // Optional: show toast
  };

  const handlePrint = () => {
    try {
      if (window.self !== window.top) {
        alert(t('printWarning'));
      }
      window.print();
    } catch (e) {
      console.error("Print failed", e);
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-6xl mx-auto space-y-8"
    >
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Cálculo Concluído</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Estimativa baseada na legislação alemã</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleCopy} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors tooltip-trigger relative group">
            <Copy className="w-4 h-4" />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Copiar</span>
          </button>
          <button onClick={handlePrint} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group relative">
            <Printer className="w-4 h-4" />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">{t('printBtn')}</span>
          </button>
          <button onClick={onDownload} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Exportar PDF</span>
          </button>
          <Link to="/comparar" className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
            <Split className="w-4 h-4" /> <span className="hidden sm:inline">Comparar</span>
          </Link>
          <button onClick={onShare} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all">
            <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Partilhar</span>
          </button>
        </div>
      </div>

      {/* Main Results Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Hero Numbers */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Gross Salary Card */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl flex items-center justify-center">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full">100%</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Salário Bruto</p>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words">
                    <CountUp value={result.gross} />
                  </h3>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> Valor antes dos impostos
                  </p>
                </div>
              </div>
            </div>

            {/* Net Salary Card */}
            <div className="bg-emerald-500 dark:bg-emerald-600 p-8 rounded-[2rem] text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                      {calculatePercentage(result.net)}%
                    </span>
                  </div>
                  <p className="text-emerald-100 font-medium mb-1">Salário Líquido</p>
                  <h3 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight break-words">
                    <CountUp value={result.net} />
                  </h3>
                </div>
                <div className="mt-6 pt-4 border-t border-emerald-400/30">
                  <p className="text-sm text-emerald-100 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Valor exato na sua conta
                  </p>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Money Timeline / Visual Comparison Bar */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white">Fluxo do Salário</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">Por {period}</span>
            </div>
            
            {/* The Bar */}
            <div className="h-4 w-full flex rounded-full overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(result.net / result.gross) * 100}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="h-full bg-emerald-500"
              />
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(result.tax / result.gross) * 100}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="h-full bg-rose-500"
              />
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(result.social / result.gross) * 100}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="h-full bg-blue-500"
              />
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Líquido</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">{calculatePercentage(result.net)}%</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Impostos</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">{calculatePercentage(result.tax)}%</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Contribuições</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">{calculatePercentage(result.social)}%</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Donut Chart & Mini insights */}
        <motion.div variants={itemVariants} className="space-y-6">
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-[360px]">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Distribuição</h3>
            <div className="flex-1 relative w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={getChartData()} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="65%" 
                    outerRadius="90%" 
                    paddingAngle={4} 
                    dataKey="value" 
                    stroke="none"
                    animationDuration={1500}
                    animationBegin={200}
                  >
                    {getChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => formatMoney(value)}
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-slate-400 font-medium text-xs uppercase tracking-widest">Líquido</span>
                 <span className="text-2xl font-bold text-slate-900 dark:text-white">{calculatePercentage(result.net)}%</span>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Interactive Breakdown Accordion */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-8 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Ver detalhes do cálculo</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total retido: {formatMoney(result.tax + result.social)}</p>
            </div>
          </div>
          <motion.div animate={{ rotate: showDetails ? 180 : 0 }}>
            <ChevronDown className="w-6 h-6 text-slate-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-8 pt-0 space-y-6 border-t border-slate-100 dark:border-slate-800">
                {detailsData.map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{calculatePercentage(item.value)}% do salário bruto</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:justify-end">
                      <div className="w-full sm:w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(item.value / (result.tax + result.social)) * 100}%` }}
                          className={cn("h-full rounded-full", item.color)}
                        />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white min-w-[100px] text-right">
                        {formatMoney(item.value)}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Total Row */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">Total Retido</span>
                  <span className="font-bold text-rose-500 text-xl">{formatMoney(result.tax + result.social)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Smart Insights Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Info className="w-6 h-6 text-blue-500 mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            O seu salário líquido representa aproximadamente <strong className="text-slate-900 dark:text-white">{calculatePercentage(result.net)}%</strong> do salário bruto.
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Info className="w-6 h-6 text-rose-500 mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            O imposto sobre o rendimento (Lohnsteuer) corresponde a <strong className="text-slate-900 dark:text-white">{calculatePercentage(result.breakdown.incomeTax)}%</strong>.
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Info className="w-6 h-6 text-indigo-500 mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            As contribuições sociais (seguros) representam <strong className="text-slate-900 dark:text-white">{calculatePercentage(result.social)}%</strong>.
          </p>
        </div>
      </motion.div>

      <TipOfTheDay />
    </motion.div>
  );
};
