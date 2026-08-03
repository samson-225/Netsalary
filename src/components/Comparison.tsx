import React, { useState, useMemo } from 'react';
import { Info, ArrowRight, Euro, FileText, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '../lib/utils';
import { calculateNet, PaymentPeriod, TaxClass, HealthInsurance, states } from '../lib/salary';

interface ScenarioConfig {
  taxClass: TaxClass;
  stateRegion: string;
  maritalStatus: 'single' | 'married';
  children: number;
  healthInsurance: HealthInsurance;
  churchTax: boolean;
}

export const Comparison = () => {
  const [grossSalary, setGrossSalary] = useState<string>('4000');
  const [period, setPeriod] = useState<PaymentPeriod>('month');
  const [age, setAge] = useState<number>(30);

  const [scenarioA, setScenarioA] = useState<ScenarioConfig>({
    taxClass: 'I',
    stateRegion: 'Baviera',
    maritalStatus: 'single',
    children: 0,
    healthInsurance: 'public',
    churchTax: false,
  });

  const [scenarioB, setScenarioB] = useState<ScenarioConfig>({
    taxClass: 'III',
    stateRegion: 'Baviera',
    maritalStatus: 'married',
    children: 1,
    healthInsurance: 'public',
    churchTax: false,
  });

  const grossNum = parseFloat(grossSalary.replace(',', '.')) || 0;

  const resultA = useMemo(() => {
    if (grossNum <= 0) return null;
    return calculateNet(grossNum, period, scenarioA.taxClass, scenarioA.children, scenarioA.healthInsurance, scenarioA.churchTax, scenarioA.stateRegion, age);
  }, [grossNum, period, scenarioA, age]);

  const resultB = useMemo(() => {
    if (grossNum <= 0) return null;
    return calculateNet(grossNum, period, scenarioB.taxClass, scenarioB.children, scenarioB.healthInsurance, scenarioB.churchTax, scenarioB.stateRegion, age);
  }, [grossNum, period, scenarioB, age]);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'EUR' }).format(val);
  };

  const chartData = useMemo(() => {
    if (!resultA || !resultB) return [];
    return [
      {
        name: 'Salário Líquido',
        'Cenário A': resultA.net,
        'Cenário B': resultB.net,
      },
      {
        name: 'Impostos',
        'Cenário A': resultA.tax,
        'Cenário B': resultB.tax,
      },
      {
        name: 'Contrib. Sociais',
        'Cenário A': resultA.social,
        'Cenário B': resultB.social,
      }
    ];
  }, [resultA, resultB]);

  const updateScenarioA = (key: keyof ScenarioConfig, value: any) => {
    setScenarioA(prev => ({ ...prev, [key]: value }));
  };

  const updateScenarioB = (key: keyof ScenarioConfig, value: any) => {
    setScenarioB(prev => ({ ...prev, [key]: value }));
  };

  const renderConfigurator = (scenario: ScenarioConfig, update: (key: keyof ScenarioConfig, val: any) => void, title: string, colorClass: string) => (
    <div className={`p-6 md:p-8 rounded-3xl border ${colorClass} bg-white dark:bg-slate-900 shadow-sm`}>
      <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-100">{title}</h3>
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Classe de Imposto</label>
          <select value={scenario.taxClass} onChange={(e) => update('taxClass', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-base outline-none text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
            <option value="I">I - Solteiro</option>
            <option value="II">II - Pai/Mãe solteiro</option>
            <option value="III">III - Casado (maior)</option>
            <option value="IV">IV - Casado (igual)</option>
            <option value="V">V - Casado (menor)</option>
            <option value="VI">VI - Segundo emprego</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Estado</label>
          <select value={scenario.stateRegion} onChange={(e) => update('stateRegion', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-base outline-none text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filhos</label>
            <input type="number" min="0" value={scenario.children} onChange={(e) => update('children', parseInt(e.target.value)||0)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-base outline-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Igreja?</label>
            <select value={scenario.churchTax ? 'yes' : 'no'} onChange={(e) => update('churchTax', e.target.value === 'yes')} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-base outline-none text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
              <option value="no">Não</option>
              <option value="yes">Sim</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto">
      <section id="comparar" className="w-full mt-8 p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-slate-900 dark:text-slate-50 tracking-tight">Comparar Cenários</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            Descubra qual a diferença no seu salário líquido alterando sua Classe de Imposto (Steuerklasse), Estado ou número de filhos.
          </p>
        </div>

        {/* Shared Configuration */}
        <div className="bg-slate-50 dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 mb-10">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4" /> Dados Básicos Compartilhados
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Salário bruto (€)</label>
              <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <span className="pl-4 text-slate-400 font-medium">€</span>
                <input
                  type="number"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(e.target.value)}
                  className="w-full px-3 py-3 bg-transparent outline-none text-slate-900 dark:text-slate-100 font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pagamento</label>
              <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 h-[50px]">
                <button onClick={() => setPeriod('hour')} className={cn("flex-1 py-1 text-sm font-semibold rounded-lg transition-colors", period === 'hour' ? "bg-slate-900 dark:bg-slate-700 text-white" : "text-slate-600 dark:text-slate-400")}>Hora</button>
                <button onClick={() => setPeriod('month')} className={cn("flex-1 py-1 text-sm font-semibold rounded-lg transition-colors", period === 'month' ? "bg-slate-900 dark:bg-slate-700 text-white" : "text-slate-600 dark:text-slate-400")}>Mês</button>
                <button onClick={() => setPeriod('year')} className={cn("flex-1 py-1 text-sm font-semibold rounded-lg transition-colors", period === 'year' ? "bg-slate-900 dark:bg-slate-700 text-white" : "text-slate-600 dark:text-slate-400")}>Ano</button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sua Idade</label>
              <input type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value)||30)} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 h-[50px]" />
            </div>
          </div>
        </div>

        {/* Scenarios Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {renderConfigurator(scenarioA, updateScenarioA, 'Cenário A', 'border-blue-200 dark:border-blue-800/50')}
          {renderConfigurator(scenarioB, updateScenarioB, 'Cenário B', 'border-purple-200 dark:border-purple-800/50')}
        </div>

        {/* Results Comparison */}
        {resultA && resultB && (
          <div className="space-y-12 animate-fade-in border-t border-slate-100 dark:border-slate-800 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 md:p-8 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 blur-2xl rounded-full"></div>
                <span className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">Salário Líquido (A)</span>
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight break-words">{formatMoney(resultA.net)}</span>
              </div>
              <div className="bg-purple-50/50 dark:bg-purple-900/10 p-6 md:p-8 rounded-[2rem] border border-purple-100 dark:border-purple-800/30 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500 opacity-5 blur-2xl rounded-full"></div>
                <span className="text-sm font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-3">Salário Líquido (B)</span>
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight break-words">{formatMoney(resultB.net)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Chart */}
            <div className="bg-slate-50 dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(val) => `€${Math.round(val/1000)}k`} width={45} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => formatMoney(value)} cursor={{fill: 'transparent'}} />
                  <Legend verticalAlign="bottom" wrapperStyle={{ paddingBottom: '0px' }} />
                  <Bar dataKey="Cenário A" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="Cenário B" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Table */}
            <div className="bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden text-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/80">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Comparativo</th>
                    <th className="px-4 py-3 font-semibold text-blue-700 dark:text-blue-400 text-right">Cenário A</th>
                    <th className="px-4 py-3 font-semibold text-purple-700 dark:text-purple-400 text-right">Cenário B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-600 dark:text-slate-400">
                  <tr>
                    <td className="px-4 py-3">Salário Bruto</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultA.gross)}</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultB.gross)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Imposto de Renda</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultA.breakdown.incomeTax)}</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultB.breakdown.incomeTax)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Solidaritätszuschlag</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultA.breakdown.soli)}</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultB.breakdown.soli)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Kirchensteuer</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultA.breakdown.church)}</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultB.breakdown.church)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Seguro Saúde</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultA.breakdown.health)}</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultB.breakdown.health)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Seguro Desemprego</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultA.breakdown.unemployment)}</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultB.breakdown.unemployment)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Previdência</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultA.breakdown.pension)}</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultB.breakdown.pension)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Seguro de Cuidados</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultA.breakdown.care)}</td>
                    <td className="px-4 py-3 text-right">{formatMoney(resultB.breakdown.care)}</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-900 font-semibold text-slate-900 dark:text-slate-100">
                    <td className="px-4 py-4">Salário Líquido Final</td>
                    <td className="px-4 py-4 text-right text-blue-600 dark:text-blue-400">{formatMoney(resultA.net)}</td>
                    <td className="px-4 py-4 text-right text-purple-600 dark:text-purple-400">{formatMoney(resultB.net)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="p-4 bg-slate-100/50 dark:bg-slate-800/50 flex justify-center border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Diferença: <span className="font-bold text-slate-900 dark:text-slate-100">{formatMoney(Math.abs(resultA.net - resultB.net))}</span>
                  {' '} a favor do Cenário {resultA.net > resultB.net ? 'A' : 'B'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
    </div>
  );
};
