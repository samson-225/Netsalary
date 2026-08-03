import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Landmark, Moon, Sun, Globe, Menu, X, Calculator, PieChart, ArrowLeftRight, Landmark as TaxIcon, Map, BookOpen, HelpCircle, Info } from 'lucide-react';
import { useAppContext, Language } from '../lib/i18n';
import { cn } from '../lib/utils';

export const Layout = () => {
  const { lang, setLang, theme, setTheme, t } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (location.pathname === '/') {
      const container = document.getElementById('main-scroll-container');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash, location.pathname]);

  const sidebarLinks = [
    { to: "/", label: t('navCalculator'), icon: Calculator },
    { to: "/comparar", label: t('navCompare'), icon: ArrowLeftRight },
    { to: "/impostos", label: t('navTaxes'), icon: TaxIcon },
    { to: "/faq", label: t('navFaq'), icon: HelpCircle },
    { to: "/about", label: t('navAbout'), icon: Info },
  ];

  const topNavLinks = [
    { label: t('navCalculator'), href: "/" },
    { label: t('navCompare'), href: "/comparar" },
    { label: t('navTaxes'), href: "/impostos" },
    { label: t('navFaq'), href: "/faq" },
  ];

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-20">
        <div className="h-20 flex items-center px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg font-display leading-none">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl font-display leading-none tracking-tight">NetSalary</span>
              <span className="text-[10px] text-slate-500 font-medium">Germany</span>
            </div>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.to && !link.to.startsWith('#');
            return (
              <Link
                key={link.label}
                to={link.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors",
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                <link.icon className={cn("w-5 h-5", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl font-medium text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            {theme === 'dark' ? 'Escuro' : 'Claro'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        
        {/* Desktop Top Nav */}
        <header className="hidden lg:flex items-center justify-between h-20 px-8 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-10">
          <nav className="flex items-center gap-6">
            {topNavLinks.map(link => (
              <Link key={link.label} to={link.href} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-6">
            <button onClick={toggleTheme} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 bg-white dark:bg-slate-800">
              <Globe className="w-4 h-4 text-slate-500" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-sm font-medium outline-none cursor-pointer"
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm transition-colors text-sm">
              Calcular Agora
            </button>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm font-display leading-none">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg font-display leading-none tracking-tight">NetSalary</span>
              <span className="text-[9px] text-slate-500 font-medium">Germany</span>
            </div>
          </Link>
          <button onClick={toggleMenu} className="p-2 text-slate-600 dark:text-slate-300">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bottom-0 bg-white dark:bg-slate-950 z-20 flex flex-col p-4 overflow-y-auto">
             <div className="flex flex-col gap-2 mb-6">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    <link.icon className="w-5 h-5 text-slate-400" />
                    {link.label}
                  </Link>
                ))}
             </div>
             <div className="mt-auto flex flex-col gap-4">
                <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3">
                  <Globe className="w-5 h-5 text-slate-500" />
                  <select 
                    value={lang} 
                    onChange={(e) => setLang(e.target.value as Language)}
                    className="bg-transparent text-base font-medium outline-none cursor-pointer w-full"
                  >
                    <option value="pt">Português</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <button 
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  Mudar Tema
                </button>
                <button className="bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl shadow-sm text-center">
                  Calcular Agora
                </button>
             </div>
          </div>
        )}

        {/* Scrollable Main Area */}
        <div id="main-scroll-container" className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-slate-900">
          <main className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </main>
          
          <footer className="mt-24 py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-center text-slate-500 dark:text-slate-400 text-sm">
             <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-4">
                <div className="flex gap-6 font-medium">
                   <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400">{t('navAbout')}</Link>
                   <a href="mailto:samsonsamy225@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400">{t('navFeedback')}</a>
                   <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">{t('navHome')}</Link>
                </div>
                <p>© {new Date().getFullYear()} {t('footerRights')}</p>
             </div>
          </footer>
        </div>

      </div>
    </div>
  );
};

