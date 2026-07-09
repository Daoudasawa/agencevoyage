import React, { useState } from 'react';
import { CompassOutlined, CalendarOutlined, TeamOutlined, CreditCardOutlined, SearchOutlined } from '@ant-design/icons';

interface SearchWidgetProps {
  onSearch: (filters: { type: string; date: string; pilgrims: number; budget: number }) => void;
}

const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch }) => {
  const [type, setType] = useState('tous');
  const [date, setDate] = useState('');
  const [pilgrims, setPilgrims] = useState(1);
  const [budget, setBudget] = useState(4000000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ type, date, pilgrims, budget });
    // Scroll down to offers section when search clicked
    const element = document.getElementById('offres');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="search" className="relative z-30 max-w-6xl mx-auto px-4 -mt-16 md:-mt-24">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-end"
      >
        {/* Type de Voyage */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Type de Voyage
          </label>
          <div className="relative">
            <CompassOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-lg" />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 pl-11 pr-4 py-3 rounded-2xl border border-transparent focus:border-emerald-500 outline-none text-sm font-medium transition-all appearance-none cursor-pointer"
            >
              <option value="tous">Tous les séjours</option>
              <option value="hajj">Hajj uniquement</option>
              <option value="omra">Omra uniquement</option>
            </select>
          </div>
        </div>

        {/* Date de Départ */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Période
          </label>
          <div className="relative">
            <CalendarOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-lg" />
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 pl-11 pr-4 py-3 rounded-2xl border border-transparent focus:border-emerald-500 outline-none text-sm font-medium transition-all appearance-none cursor-pointer"
            >
              <option value="">Tous les mois</option>
              <option value="2026-03">Mars 2026 (Ramadan)</option>
              <option value="2026-06">Juin 2026 (Hajj)</option>
              <option value="2026-09">Septembre 2026</option>
              <option value="2026-12">Décembre 2026</option>
            </select>
          </div>
        </div>

        {/* Nombre de Pèlerins */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Pèlerins
          </label>
          <div className="relative">
            <TeamOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-lg" />
            <input
              type="number"
              min="1"
              max="10"
              value={pilgrims}
              onChange={(e) => setPilgrims(parseInt(e.target.value) || 1)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 pl-11 pr-4 py-3 rounded-2xl border border-transparent focus:border-emerald-500 outline-none text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* Budget Maximum */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Budget Max
            </label>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {(budget / 1000000).toFixed(1)}M FCFA
            </span>
          </div>
          <div className="relative">
            <CreditCardOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-lg" />
            <input
              type="range"
              min="800000"
              max="5000000"
              step="100000"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="w-full accent-emerald-600 bg-zinc-150 dark:bg-zinc-800 h-2 rounded-lg cursor-pointer mt-4"
            />
          </div>
        </div>

        {/* Bouton Rechercher */}
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <SearchOutlined className="text-base" />
          Rechercher
        </button>
      </form>
    </div>
  );
};

export default SearchWidget;
