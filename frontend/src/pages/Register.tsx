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
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (password !== passwordConfirm) {
      setErrorMsg('Les deux mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Le mot de passe doit contenir au moins 8 caractères.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/register', {
        nom, prenom, email, telephone,
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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    padding: '12px 16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: "'Outfit', 'Inter', sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: 7,
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: 14,
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a1f0f 0%, #0d3b1e 40%, #1a1a2e 100%)',
      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
      padding: '32px 16px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ width: '100%', maxWidth: 500 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64,
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 14px',
          }}>👤</div>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: 0 }}>Créer un compte</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 6 }}>
            Inscrivez-vous pour initier vos démarches de pèlerinage
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24,
          padding: '32px',
        }}>
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

          <form onSubmit={handleSubmit}>
            {/* Nom & Prénom */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Nom</label>
                <input
                  type="text" required value={nom}
                  onChange={e => setNom(e.target.value)}
                  placeholder="Ex: Ouédraogo" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.7)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Prénom</label>
                <input
                  type="text" required value={prenom}
                  onChange={e => setPrenom(e.target.value)}
                  placeholder="Ex: Moussa" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.7)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Adresse E-mail</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.7)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Téléphone</label>
              <input
                type="tel" required value={telephone}
                onChange={e => setTelephone(e.target.value)}
                placeholder="+226 70 00 00 00" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.7)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Mot de Passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 caractères"
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.7)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Confirmer le Mot de Passe</label>
              <input
                type={showPass ? 'text' : 'password'} required value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                placeholder="Répéter le mot de passe" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.7)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'rgba(16,185,129,0.4)' : '#059669',
                color: '#fff', fontWeight: 800, fontSize: 15, padding: '15px',
                borderRadius: 12, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 24px rgba(5,150,105,0.35)',
                transition: 'all 0.2s', letterSpacing: '0.02em',
                fontFamily: "'Outfit', 'Inter', sans-serif",
              }}
            >
              {loading ? '⏳ Inscription en cours...' : 'Créer mon compte →'}
            </button>
          </form>
        </div>

        {/* Liens */}
        <p style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
          Vous avez déjà un compte ?{' '}
          <Link to="/connexion" style={{ color: '#34d399', fontWeight: 700, textDecoration: 'none' }}>
            Se connecter
          </Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 6 }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, textDecoration: 'none' }}>
            ← Retour à la page d'accueil
          </Link>
        </p>
      </motion.div>

      <style>{`input::placeholder { color: rgba(255,255,255,0.25) !important; }`}</style>
    </div>
  );
};

export default Register;
