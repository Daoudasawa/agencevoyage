import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Register: React.FC = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await api.post('/register', {
        nom,
        prenom,
        email,
        telephone,
        password,
        password_confirmation: passwordConfirm,
      });
      const { token, user } = response.data;
      login(token, user);
      navigate('/pelerin/dashboard');
    } catch (error: any) {
      const data = error.response?.data;
      if (data?.errors) {
        const firstKey = Object.keys(data.errors)[0];
        setErrorMsg(data.errors[firstKey][0]);
      } else {
        setErrorMsg(data?.message || "Une erreur est survenue lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-[#E8E2D5] focus:border-[#2D5A4C] focus:ring-2 focus:ring-[#2D5A4C]/20 rounded-xl text-[#1F2937] text-sm p-3.5 outline-none transition-all placeholder:text-slate-400 shadow-sm";
  const labelClass = "block text-[#1F2937] text-[11px] font-bold uppercase tracking-wider mb-2";

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex items-center justify-center p-4 sm:p-6">
      {/* Décoration de fond subtile */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#2D5A4C] via-[#B45309] to-[#2D5A4C]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#2D5A4C] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg text-[#FEF3C7] border border-[#B45309]/30">
            🕋
          </div>
          <div className="text-[#2D5A4C] font-black text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            ASEMAOU Voyage & Tourisme HDJ
          </div>
          <h1 className="text-[#2D5A4C] text-2xl font-black mt-2">Créer un Compte</h1>
          <p className="text-[#4B5563] text-sm mt-1">Inscrivez-vous pour initier vos démarches de pèlerinage</p>
        </div>

        {/* Carte formulaire */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-200/50">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom & Prénom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nom</label>
                <input
                  type="text" required value={nom}
                  onChange={e => setNom(e.target.value)}
                  placeholder="Ex: Ouédraogo"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Prénom</label>
                <input
                  type="text" required value={prenom}
                  onChange={e => setPrenom(e.target.value)}
                  placeholder="Ex: Moussa"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Adresse E-mail</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Téléphone</label>
              <input
                type="tel" required value={telephone}
                onChange={e => setTelephone(e.target.value)}
                placeholder="+226 70 00 00 00"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Mot de Passe</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 caractères"
                  className={inputClass + ' pr-12'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1F2937] transition-colors text-base">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Confirmer le Mot de Passe</label>
              <input
                type={showPass ? 'text' : 'password'} required value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                placeholder="Répéter le mot de passe"
                className={inputClass}
              />
            </div>

            {/* Séparateur */}
            <div className="border-t border-[#E8E2D5] pt-2" />

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full !py-4 !text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all duration-200"
            >
              {loading ? '⏳ Inscription en cours...' : 'Créer mon compte →'}
            </button>
          </form>
        </div>

        {/* Liens */}
        <p className="text-center mt-6 text-[#4B5563] text-xs">
          Vous avez déjà un compte ?{' '}
          <Link to="/connexion" className="text-[#2D5A4C] font-bold hover:text-[#B45309] transition-colors">
            Se connecter
          </Link>
        </p>
        <p className="text-center mt-2">
          <Link to="/" className="text-slate-400 hover:text-[#2D5A4C] text-xs transition-colors">
            ← Retour à l'accueil
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
