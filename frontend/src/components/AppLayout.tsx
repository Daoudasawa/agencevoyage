import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  UserOutlined,
  CompassOutlined,
  HomeOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/connexion');
  };

  // Définir les items de menu selon le rôle de l'utilisateur
  const getMenuItems = () => {
    if (!user) return [];
    const baseItems = [];

    if (user.role === 'admin') {
      baseItems.push(
        {
          key: '/admin/dashboard',
          icon: <DashboardOutlined />,
          label: <Link to="/admin/dashboard">Tableau de bord</Link>,
        },
        {
          key: '/admin/forfaits',
          icon: <CompassOutlined />,
          label: <Link to="/admin/forfaits">Gestion des Forfaits</Link>,
        },
        {
          key: '/admin/vols',
          icon: <CalendarOutlined />,
          label: <Link to="/admin/vols">Gestion des Vols</Link>,
        },
        {
          key: '/admin/hotels',
          icon: <HomeOutlined />,
          label: <Link to="/admin/hotels">Gestion des Hôtels</Link>,
        },
        {
          key: '/admin/utilisateurs',
          icon: <SettingOutlined />,
          label: <Link to="/admin/utilisateurs">Utilisateurs & Agents</Link>,
        },
        {
          key: '/admin/cms',
          icon: <FileTextOutlined />,
          label: <Link to="/admin/cms">Contenu Site (CMS)</Link>,
        }
      );
    } else if (user.role === 'agent') {
      baseItems.push(
        {
          key: '/agent/dashboard',
          icon: <DashboardOutlined />,
          label: <Link to="/agent/dashboard">Tableau de bord</Link>,
        },
        {
          key: '/agent/pelerins',
          icon: <UserOutlined />,
          label: <Link to="/agent/pelerins">Liste des Pèlerins</Link>,
        },
        {
          key: '/agent/groupes',
          icon: <TeamOutlined />,
          label: <Link to="/agent/groupes">Gestion des Groupes</Link>,
        }
      );
    } else if (user.role === 'pelerin') {
      baseItems.push(
        {
          key: '/pelerin/dashboard',
          icon: <DashboardOutlined />,
          label: <Link to="/pelerin/dashboard">Mon Dossier</Link>,
        },
        {
          key: '/pelerin/forfaits',
          icon: <CompassOutlined />,
          label: <Link to="/pelerin/forfaits">Forfaits Disponibles</Link>,
        }
      );
    }

    return baseItems;
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Mon Profil',
      icon: <UserOutlined />,
      disabled: true,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Se déconnecter',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/admin/forfaits')) return '/admin/forfaits';
    if (path.startsWith('/admin/vols')) return '/admin/vols';
    if (path.startsWith('/admin/hotels')) return '/admin/hotels';
    if (path.startsWith('/admin/utilisateurs')) return '/admin/utilisateurs';
    if (path.startsWith('/admin/cms')) return '/admin/cms';
    if (path.startsWith('/agent/pelerins')) return '/agent/pelerins';
    if (path.startsWith('/agent/groupes')) return '/agent/groupes';
    return path;
  };

  const roleLabels: Record<string, string> = {
    admin: 'Administrateur',
    agent: 'Agent Agence',
    pelerin: 'Pèlerin',
  };

  const roleBadgeStyle: Record<string, React.CSSProperties> = {
    admin: { background: '#B45309', color: '#fff' },
    agent: { background: '#2D5A4C', color: '#fff' },
    pelerin: { background: '#3D6B5D', color: '#fff' },
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#FDFBF7' }}>
      {/* ── SIDEBAR ── */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: '4px 0 20px rgba(45,90,76,0.08)',
          background: '#2D5A4C',
          borderRight: 'none',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(180, 83, 9, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 72,
        }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>🕌</span>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <div style={{
                  color: '#FEF3C7',
                  fontWeight: 900,
                  fontSize: 13,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                }}>ASEMAOU</div>
                <div style={{
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: 9,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>Voyage & Tourisme HDJ</div>
              </Link>
            </div>
          )}
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={getMenuItems()}
          style={{
            background: '#2D5A4C',
            border: 'none',
            paddingTop: 8,
            flex: 1,
          }}
        />

        {/* Bouton collapse en bas */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-end',
            paddingRight: collapsed ? 0 : 20,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 16,
            transition: 'all 0.2s',
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          {!collapsed && <span style={{ fontSize: 11, marginLeft: 6, letterSpacing: '0.05em' }}>Réduire</span>}
        </div>
      </Sider>

      {/* ── MAIN LAYOUT ── */}
      <Layout style={{
        marginLeft: collapsed ? 80 : 200,
        transition: 'margin-left 0.2s ease',
        background: '#FDFBF7',
        minHeight: '100vh',
      }}>
        {/* Top Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: '#ffffff',
          borderBottom: '1px solid #E8E2D5',
          boxShadow: '0 1px 8px rgba(45,90,76,0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          height: 64,
        }}>
          {/* Fil d'Ariane / Page title placeholder */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 4,
              height: 20,
              borderRadius: 99,
              background: '#B45309',
            }} />
            <span style={{ color: '#2D5A4C', fontWeight: 700, fontSize: 15 }}>
              Espace {roleLabels[user?.role || 'pelerin']}
            </span>
          </div>

          {/* Zone utilisateur */}
          <Space size="middle">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1F2937', lineHeight: 1.3 }}>
                {user?.prenom} {user?.nom}
              </div>
              <span style={{
                fontSize: 10,
                color: '#fff',
                padding: '2px 10px',
                borderRadius: 99,
                display: 'inline-block',
                marginTop: 3,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                ...roleBadgeStyle[user?.role || 'pelerin'],
              }}>
                {roleLabels[user?.role || 'pelerin']}
              </span>
            </div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <Avatar
                style={{ backgroundColor: '#2D5A4C', cursor: 'pointer', border: '2px solid #B45309' }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </Space>
        </div>

        {/* Content */}
        <Content style={{
          margin: '24px',
          minHeight: 280,
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
