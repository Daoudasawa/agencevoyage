import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, theme } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  UserOutlined,
  CompassOutlined,
  HomeOutlined,
  CalendarOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  TeamOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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

  // Obtenir la clé active pour le menu (chemin de base)
  const getSelectedKey = () => {
    const path = location.pathname;
    // Gérer les cas où le chemin est imbriqué (ex: /agent/pelerins/5)
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

  const roleColors: Record<string, string> = {
    admin: '#d48806',
    agent: '#1d39c4',
    pelerin: '#389e0d',
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          background: '#0d2b18', // Vert très sombre pour le menu
        }}
      >
        <div style={{
          height: 64,
          margin: 16,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            color: '#c9a84c', // Doré pour le logo
            margin: 0,
            fontSize: collapsed ? '1.2rem' : '1.4rem',
            fontWeight: 'bold',
            textAlign: 'center',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}>
            {collapsed ? 'H&O' : 'Hajj & Omra'}
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={getMenuItems()}
          style={{ background: '#0d2b18' }}
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: 0,
          background: colorBgContainer,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: 24,
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          zIndex: 1
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />

          <Space size="middle">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', lineHeight: '1.2' }}>{user?.prenom} {user?.nom}</div>
              <span style={{
                fontSize: '11px',
                color: '#fff',
                background: roleColors[user?.role || 'pelerin'],
                padding: '2px 8px',
                borderRadius: '10px',
                display: 'inline-block',
                marginTop: '4px'
              }}>
                {roleLabels[user?.role || 'pelerin']}
              </span>
            </div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <Avatar
                style={{ backgroundColor: '#1a6b3a', cursor: 'pointer' }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflowY: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
