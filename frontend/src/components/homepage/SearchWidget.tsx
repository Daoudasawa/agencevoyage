import React, { useState } from 'react';

interface SearchWidgetProps {
  onSearch: (filters: { type: string; date: string; pilgrims: number; budget: number }) => void;
}

const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch }) => {
  const [type, setType] = useState('tous');
  const [date, setDate] = useState('');
  const [pilgrims, setPilgrims] = useState(1);
  const [budget] = useState(4000000);

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
    <div id="search" className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10">
      <div className="bg-white rounded-3xl shadow-xl border border-[#E8E2D5] p-6 md:p-8">
        {/* Tabs: Omra / Hajj */}
        <div className="flex items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setType('omra')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              type === 'omra' || type === 'tous'
                ? 'bg-[#EBF2EE] text-[#2D5A4C] border border-[#2D5A4C]/25 shadow-sm'
                : 'bg-[#F5F0E6] text-[#4B5563] hover:bg-[#E8E2D5]'
            }`}
          >
            <span>🕋</span> Omra
          </button>
          <button
            type="button"
            onClick={() => setType('hajj')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              type === 'hajj'
                ? 'bg-[#EBF2EE] text-[#2D5A4C] border border-[#2D5A4C]/25 shadow-sm'
                : 'bg-[#F5F0E6] text-[#4B5563] hover:bg-[#E8E2D5]'
            }`}
          >
            <span>🕌</span> Hajj
          </button>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Ville de départ */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1F2937]">Ville de départ</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">📍</span>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#FDFBF7] text-[#1F2937] pl-10 pr-4 py-3 rounded-xl border border-[#E8E2D5] focus:border-[#2D5A4C] focus:ring-1 focus:ring-[#2D5A4C] outline-none text-xs font-semibold appearance-none cursor-pointer"
              >
                <option value="">Sélectionnez votre ville</option>
                <option value="ouaga">Ouagadougou</option>
                <option value="bobo">Bobo-Dioulasso</option>
              </select>
            </div>
          </div>

          {/* Date de départ */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1F2937]">Date de départ</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">📅</span>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#FDFBF7] text-[#1F2937] pl-10 pr-4 py-3 rounded-xl border border-[#E8E2D5] focus:border-[#2D5A4C] focus:ring-1 focus:ring-[#2D5A4C] outline-none text-xs font-semibold appearance-none cursor-pointer"
              >
                <option value="">Sélectionnez une date</option>
                <option value="2026-03">Mars 2026 (Ramadan)</option>
                <option value="2026-06">Juin 2026 (Hajj)</option>
                <option value="2026-09">Septembre 2026</option>
              </select>
            </div>
          </div>

          {/* Durée du séjour */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1F2937]">Durée du séjour</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🕒</span>
              <select
                className="w-full bg-[#FDFBF7] text-[#1F2937] pl-10 pr-4 py-3 rounded-xl border border-[#E8E2D5] focus:border-[#2D5A4C] focus:ring-1 focus:ring-[#2D5A4C] outline-none text-xs font-semibold appearance-none cursor-pointer"
              >
                <option value="">Sélectionnez</option>
                <option value="12">12 Jours</option>
                <option value="14">14 Jours</option>
                <option value="21">21 Jours</option>
                <option value="30">1 Mois complet</option>
              </select>
            </div>
          </div>

          {/* Nombre de personnes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1F2937]">Nombre de personnes</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">👤</span>
              <select
                value={pilgrims}
                onChange={(e) => setPilgrims(parseInt(e.target.value) || 1)}
                className="w-full bg-[#FDFBF7] text-[#1F2937] pl-10 pr-4 py-3 rounded-xl border border-[#E8E2D5] focus:border-[#2D5A4C] focus:ring-1 focus:ring-[#2D5A4C] outline-none text-xs font-semibold appearance-none cursor-pointer"
              >
                <option value={1}>1 personne</option>
                <option value={2}>2 personnes (Couple)</option>
                <option value={4}>4 personnes (Famille)</option>
              </select>
            </div>
          </div>

          {/* Action CTA Search Button (10% Accent Terre Cuite) */}
          <button
            type="submit"
            className="btn-primary w-full !py-3 !px-6 !text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            Rechercher
            <span>🔍</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchWidget;
