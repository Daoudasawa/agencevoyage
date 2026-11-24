import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;
      if (!user.active) {
        setErrorMsg('Votre compte a été désactivé par un administrateur.');
        setLoading(false);
        return;
      }
      login(token, user);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'agent') navigate('/agent/dashboard');
      else navigate('/pelerin/dashboard');
    } catch (error: any) {
      const data = error.response?.data;
      if (data?.errors?.email) {
        setErrorMsg(data.errors.email[0]);
      } else {
        setErrorMsg(data?.message || 'Identifiants incorrects ou serveur indisponible.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#FDFBF7]">
      {/* Panneau gauche — visuel premium (Vert Sauge Foncé 30%) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#2D5A4C]">
        <img
          src="https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80"
          alt="La Mecque"
          className="w-full h-full object-cover opacity-20 scale-105"
        />
        {/* Overlay dégradé */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2D5A4C]/95 via-[#2D5A4C]/85 to-[#23473C]/95" />

        {/* Contenu panneau gauche */}
        <div className="absolute inset-0 flex flex-col justify-between p-14">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🕌</span>
              <div>
                <div className="text-[#FEF3C7] font-black text-lg leading-tight tracking-tight">ASEMAOU</div>
                <div className="text-white/70 text-xs tracking-widest uppercase">Voyage & Tourisme HDJ</div>
              </div>
            </div>
          </div>

          {/* Citation centrale */}
          <div>
            <div className="inline-block bg-[#B45309]/30 border border-[#FEF3C7]/40 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[#FEF3C7] text-xs font-bold uppercase tracking-[0.2em]">Plateforme officielle</span>
            </div>
            <h2 className="text-white text-4xl font-black leading-tight mb-5 max-w-md" style={{ fontFamily: "'Playfair Display', serif" }}>
              Accomplissez votre pèlerinage{' '}
              <span className="text-[#FEF3C7] italic">en toute sérénité</span>
            </h2>
            <p className="text-white/75 text-base leading-relaxed max-w-sm">
              Réservations Hajj & Omra, démarches administratives et hébergements d'exception depuis le Burkina Faso.
            </p>
          </div>

          {/* Stats réassurance */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '20 ans', label: "d'expérience" },
              { value: '+12 000', label: 'pèlerins accompagnés' },
              { value: '100%', label: 'visa garanti' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 border border-white/15 rounded-2xl p-4 text-center">
                <div className="text-[#FEF3C7] font-black text-xl mb-1">{stat.value}</div>
                <div className="text-white/70 text-xs leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panneau droite — formulaire (Fond Crème Sable 60%) */}
      <div className="w-full max-w-md mx-auto flex flex-col justify-center p-8 sm:p-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* En-tête mobile */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-4xl block mb-2">🕌</span>
            <div className="text-[#2D5A4C] font-black text-xl">ASEMAOU</div>
            <div className="text-[#4B5563] text-xs uppercase tracking-widest">Voyage & Tourisme HDJ</div>
          </div>

          <div className="mb-8">
            <h1 className="text-[#2D5A4C] text-3xl font-black mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bienvenue
            </h1>
            <p className="text-[#4B5563] text-sm">Connectez-vous à votre espace personnel</p>
          </div>

          {/* Erreur */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm flex items-center gap-3"
            >
              <span className="text-lg">⚠️</span>
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[#1F2937] text-xs font-bold uppercase tracking-wider mb-2">
                Adresse E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full bg-white border border-[#E8E2D5] focus:border-[#2D5A4C] focus:ring-2 focus:ring-[#2D5A4C]/20 rounded-xl text-[#1F2937] text-sm p-4 outline-none transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-[#1F2937] text-xs font-bold uppercase tracking-wider mb-2">
                Mot de Passe
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#E8E2D5] focus:border-[#2D5A4C] focus:ring-2 focus:ring-[#2D5A4C]/20 rounded-xl text-[#1F2937] text-sm p-4 pr-12 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1F2937] transition-colors text-base"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Bouton connexion (10% Accent Terre Cuite) */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-4 !text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all duration-200 mt-2"
            >
              {loading ? '⏳ Connexion en cours...' : 'Se Connecter →'}
            </button>
          </form>

          {/* Info démo */}
          <div className="mt-7 bg-[#FEF3C7] border border-[#B45309]/30 rounded-xl p-4 text-center">
            <p className="text-[#B45309] text-[10px] font-bold uppercase tracking-wider mb-1">
              Compte Démo Administrateur
            </p>
            <p className="text-[#1F2937] text-xs font-mono font-semibold">
              admin@hajjomra.bf &nbsp;/&nbsp; password
            </p>
          </div>

          {/* Liens */}
          <p className="text-center mt-6 text-[#4B5563] text-xs">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="text-[#2D5A4C] font-bold hover:text-[#B45309] transition-colors">
              S'inscrire
            </Link>
          </p>
          <p className="text-center mt-3">
            <Link to="/" className="text-slate-400 hover:text-[#2D5A4C] text-xs transition-colors">
              ← Retour à l'accueil
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
