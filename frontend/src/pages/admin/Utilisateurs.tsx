import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  Card,
  Button,
  Tag,
  Typography,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Popconfirm,
  message,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title, Text } = Typography;

const AdminUtilisateurs: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // 1. Fetch users list
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', roleFilter, currentPage],
    queryFn: async () => {
      const url = roleFilter === 'all'
        ? `/admin/utilisateurs?page=${currentPage}`
        : `/admin/utilisateurs?role=${roleFilter}&page=${currentPage}`;
      const response = await api.get(url);
      return response.data;
    },
  });

  // Mutation to create/update user
  const saveUserMutation = useMutation({
    mutationFn: async (values: any) => {
      if (editingUser) {
        // Enlever le MDP s'il n'est pas changé
        const payload = { ...values };
        if (!payload.password) delete payload.password;
        const response = await api.put(`/admin/utilisateurs/${editingUser.id}`, payload);
        return response.data;
      } else {
        const response = await api.post('/admin/utilisateurs', values);
        return response.data;
      }
    },
    onSuccess: () => {
      message.success(editingUser ? 'Compte mis à jour.' : 'Compte agent créé.');
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur.');
    },
  });

  // Mutation to toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.put(`/admin/utilisateurs/${id}/toggle-active`);
      return response.data;
    },
    onSuccess: (data) => {
      message.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => {
      message.error('Erreur de modification du compte.');
    },
  });

  // Mutation to delete user
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/utilisateurs/${id}`);
    },
    onSuccess: () => {
      message.success('Utilisateur supprimé.');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur de suppression.');
    },
  });

  const handleEdit = (record: any) => {
    setEditingUser(record);
    form.setFieldsValue({
      nom: record.nom,
      prenom: record.prenom,
      email: record.email,
      role: record.role,
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({ role: 'agent' });
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Nom / Prénom',
      key: 'nom',
      render: (_: any, record: any) => (
        <Space>
          <AvatarIcon role={record.role} />
          <div>
            <Text strong>{record.nom} {record.prenom}</Text>
            <div style={{ fontSize: '12px', color: '#888' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const labels: Record<string, string> = {
          admin: 'Administrateur',
          agent: 'Agent Agence',
          pelerin: 'Pèlerin',
        };
        const colors: Record<string, string> = {
          admin: 'gold',
          agent: 'blue',
          pelerin: 'green',
        };
        return <Tag color={colors[role] || 'default'}>{labels[role] || role}</Tag>;
      },
    },
    {
      title: 'Accès / Activation',
      key: 'active',
      render: (_: any, record: any) => {
        if (record.role === 'admin') return <Tag color="green">Toujours actif</Tag>;
        return (
          <Switch
            checked={record.active}
            onChange={() => toggleActiveMutation.mutate(record.id)}
            checkedChildren="Actif"
            unCheckedChildren="Désactivé"
            loading={toggleActiveMutation.isPending}
          />
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => {
        if (record.role === 'pelerin') return null; // Les pelerins sont gérés dans leur module dédié
        return (
          <Space>
            <Button type="default" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
              Modifier
            </Button>
            {record.role !== 'admin' && (
              <Popconfirm title="Supprimer cet utilisateur ?" onConfirm={() => deleteUserMutation.mutate(record.id)} okText="Supprimer" cancelText="Annuler">
                <Button danger icon={<DeleteOutlined />} size="small" />
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  // Helper avatar decorator
  const AvatarIcon = ({ role }: { role: string }) => {
    const colors: Record<string, string> = {
      admin: '#d48806',
      agent: '#1890ff',
      pelerin: '#52c41a',
    };
    return (
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: colors[role] || '#ccc',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
        }}
      >
        <UserOutlined style={{ fontSize: '16px' }} />
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ color: '#1a6b3a', margin: 0 }}>
            <SettingOutlined /> Comptes Utilisateurs
          </Title>
          <Text type="secondary">Gérez les accès des agents de l'agence et les comptes de la plateforme</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{ backgroundColor: '#1a6b3a', borderColor: '#13522b' }}
          >
            Créer un Agent
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: '24px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <Space size="middle">
          <Text strong>Filtrer par rôle :</Text>
          <Select value={roleFilter} onChange={(v) => { setRoleFilter(v); setCurrentPage(1); }} style={{ width: 200 }}>
            <Select.Option value="all">Tous les rôles</Select.Option>
            <Select.Option value="admin">Administrateurs</Select.Option>
            <Select.Option value="agent">Agents</Select.Option>
            <Select.Option value="pelerin">Pèlerins</Select.Option>
          </Select>
        </Space>
      </Card>

      <Card style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <Table
          columns={columns}
          dataSource={usersData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            total: usersData?.total || 0,
            pageSize: usersData?.per_page || 20,
            onChange: (page) => setCurrentPage(page),
          }}
          size="middle"
        />
      </Card>

      {/* User Modal Form */}
      <Modal
        title={editingUser ? 'Modifier le compte' : 'Créer un compte Agent'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={saveUserMutation.mutate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="nom" label="Nom" rules={[{ required: true, message: 'Requis.' }]}>
                <Input placeholder="Nom" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="prenom" label="Prénom" rules={[{ required: true, message: 'Requis.' }]}>
                <Input placeholder="Prénom" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="email" label="Adresse email" rules={[{ required: true, message: 'Requis.' }, { type: 'email', message: 'Invalide.' }]}>
            <Input placeholder="Ex: agent.moussa@hajjomra.bf" />
          </Form.Item>

          <Form.Item
            name="password"
            label={editingUser ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe initial'}
            rules={[{ required: !editingUser, message: 'Requis.' }, { min: 8, message: 'Au moins 8 caractères.' }]}
          >
            <Input.Password placeholder="Au moins 8 caractères" />
          </Form.Item>

          <Form.Item name="role" label="Rôle de l'utilisateur" rules={[{ required: true, message: 'Requis.' }]}>
            <Select disabled={editingUser && editingUser.role === 'admin'}>
              <Select.Option value="agent">Agent Agence</Select.Option>
              <Select.Option value="admin">Administrateur Direction</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button type="primary" htmlType="submit" loading={saveUserMutation.isPending} style={{ backgroundColor: '#1a6b3a' }}>
                Enregistrer
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUtilisateurs;
