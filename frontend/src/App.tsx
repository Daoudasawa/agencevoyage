import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import frFR from 'antd/locale/fr_FR';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

// Public Pages
import HomePage from './pages/public/HomePage';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Pelerin Pages
import PelerinDashboard from './pages/pelerin/Dashboard';
import PelerinForfaits from './pages/pelerin/Forfaits';

// Agent Pages
import AgentDashboard from './pages/agent/Dashboard';
import AgentPelerins from './pages/agent/Pelerins';
import AgentPelerinDetails from './pages/agent/PelerinDetails';
import AgentGroupes from './pages/agent/Groupes';
import AgentGroupeDetails from './pages/agent/GroupeDetails';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminForfaits from './pages/admin/Forfaits';
import AdminVols from './pages/admin/Vols';
import AdminHotels from './pages/admin/Hotels';
import AdminUtilisateurs from './pages/admin/Utilisateurs';
import CmsManager from './pages/admin/CmsManager';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={frFR}
      theme={{
        token: {
          colorPrimary: '#16a34a',
          colorPrimaryHover: '#15803d',
          colorPrimaryActive: '#0d3b1e',
          borderRadius: 8,
          fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* ─── Public Routes ──────────────────────────── */}
              <Route path="/" element={<HomePage />} />
              <Route path="/connexion" element={<Login />} />
              <Route path="/inscription" element={<Register />} />

              {/* ─── Pèlerin Protected Routes ───────────────── */}
              <Route element={<ProtectedRoute allowedRoles={['pelerin']} />}>
                <Route
                  path="/pelerin/*"
                  element={
                    <AppLayout>
                      <Routes>
                        <Route path="dashboard" element={<PelerinDashboard />} />
                        <Route path="forfaits" element={<PelerinForfaits />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                      </Routes>
                    </AppLayout>
                  }
                />
              </Route>

              {/* ─── Agent & Admin Protected Routes ─────────── */}
              <Route element={<ProtectedRoute allowedRoles={['agent', 'admin']} />}>
                <Route
                  path="/agent/*"
                  element={
                    <AppLayout>
                      <Routes>
                        <Route path="dashboard" element={<AgentDashboard />} />
                        <Route path="pelerins" element={<AgentPelerins />} />
                        <Route path="pelerins/:id" element={<AgentPelerinDetails />} />
                        <Route path="groupes" element={<AgentGroupes />} />
                        <Route path="groupes/:id" element={<AgentGroupeDetails />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                      </Routes>
                    </AppLayout>
                  }
                />
              </Route>

              {/* ─── Admin Only Protected Routes ─────────────── */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route
                  path="/admin/*"
                  element={
                    <AppLayout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="forfaits" element={<AdminForfaits />} />
                        <Route path="vols" element={<AdminVols />} />
                        <Route path="hotels" element={<AdminHotels />} />
                        <Route path="utilisateurs" element={<AdminUtilisateurs />} />
                        <Route path="cms" element={<CmsManager />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                      </Routes>
                    </AppLayout>
                  }
                />
              </Route>

              {/* ─── Fallback ─────────────────────────────────── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
