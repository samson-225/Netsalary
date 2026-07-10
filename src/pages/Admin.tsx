import React, { useState, useEffect } from 'react';

export const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('admin_logged_in') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded password for prototype
      localStorage.setItem('admin_logged_in', 'true');
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Senha incorreta.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-md mx-auto mt-24 p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-50 text-center">Acesso Administrativo</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Senha (admin123)</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              placeholder="Digite a senha..."
            />
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Painel Administrativo</h1>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
          Sair
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
          <p className="text-sm text-slate-500 font-semibold uppercase">Visitas Hoje</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">1,204</p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
          <p className="text-sm text-slate-500 font-semibold uppercase">Cálculos Realizados</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">853</p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
          <p className="text-sm text-slate-500 font-semibold uppercase">Compartilhamentos</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">126</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Configurações Gerais</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">Aqui você pode gerenciar anúncios, scripts de tracking e configurações do site no futuro.</p>
      
      <div className="space-y-4">
        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Google AdSense</p>
              <p className="text-sm text-slate-500">Status dos blocos de anúncio ativos</p>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold">Ativo</div>
          </div>
        </div>
        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Modo de Manutenção</p>
              <p className="text-sm text-slate-500">Bloqueia acesso ao site para usuários externos</p>
            </div>
            <button className="px-3 py-1 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-full text-xs font-bold transition-colors hover:bg-slate-300">Desativado</button>
          </div>
        </div>
      </div>
    </div>
  );
};
