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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #0a1f0f 0%, #0d3b1e 40%, #1a1a2e 100%)',
      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
    }}>
      {/* Panneau gauche — visuel */}
      <div style={{
        flex: 1,
        display: 'none',
        position: 'relative',
        overflow: 'hidden',
      }} className="lg-panel">
        <img
          src="https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80"
          alt="La Mecque"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, #0a1f0f 0%, transparent 50%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '60px',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}></div>
          <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 900, lineHeight: 1.2, marginBottom: 16 }}>
            Accomplissez votre pèlerinage en toute sérénité
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.6 }}>
            Plateforme de gestion Hajj & Omra - Agence  de Voyage du Burkina Faso
          </p>
        </div>
      </div>

      {/* Panneau droite — formulaire */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px 32px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 64, height: 64,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, margin: '0 auto 16px',
            }}>🕌</div>
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 900, margin: 0 }}>Hajj & Omra BF</h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginTop: 6 }}>
              Connectez-vous à votre espace
            </p>
          </div>

          {/* Erreur */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: 12,
                padding: '12px 16px',
                marginBottom: 20,
                color: '#fca5a5',
                fontSize: 14,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <span>⚠️</span> {errorMsg}
            </motion.div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                Adresse E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12, color: '#fff', fontSize: 15,
                  padding: '13px 16px', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.7)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                Mot de Passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 12, color: '#fff', fontSize: 15,
                    padding: '13px 48px 13px 16px', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.7)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, lineHeight: 1,
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'rgba(16,185,129,0.4)' : '#059669',
                color: '#fff',
                fontWeight: 800,
                fontSize: 15,
                padding: '15px',
                borderRadius: 12,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 24px rgba(5,150,105,0.35)',
                transition: 'all 0.2s',
                letterSpacing: '0.02em',
              }}
            >
              {loading ? '⏳ Connexion en cours...' : 'Se Connecter →'}
            </button>
          </form>

          {/* Info démo */}
          <div style={{
            marginTop: 24,
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 12,
            padding: '14px 16px',
            textAlign: 'center',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
              Compte Démo Admin
            </p>
            <p style={{ color: '#6ee7b7', fontSize: 14, fontFamily: 'monospace', fontWeight: 600 }}>
              admin@hajjomra.bf&nbsp;&nbsp;/&nbsp;&nbsp;password
            </p>
          </div>

          {/* Lien inscription */}
          <p style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            Pas de compte ?{' '}
            <Link to="/inscription" style={{ color: '#34d399', fontWeight: 700, textDecoration: 'none' }}>
              S'inscrire
            </Link>
          </p>

          {/* Retour accueil */}
          <p style={{ textAlign: 'center', marginTop: 8 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, textDecoration: 'none' }}>
              ← Retour à la page d'accueil
            </Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg-panel { display: flex !important; }
        }
        input::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>
    </div>
  );
};

export default Login;
