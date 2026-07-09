import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  Card,
  Button,
  Typography,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Popconfirm,
  message,
  Row,
  Col,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import api from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AdminVols: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingVol, setEditingVol] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 1. Fetch flights
  const { data: vols, isLoading } = useQuery({
    queryKey: ['admin-vols'],
    queryFn: async () => {
      const response = await api.get('/admin/vols');
      return response.data.data || response.data;
    },
  });

  // Mutation to create/update flight
  const saveVolMutation = useMutation({
    mutationFn: async (values: any) => {
      const payload = {
        ...values,
        date_depart: values.date_depart.format('YYYY-MM-DD HH:mm:ss'),
      };
      if (editingVol) {
        const response = await api.put(`/admin/vols/${editingVol.id}`, payload);
        return response.data;
      } else {
        const response = await api.post('/admin/vols', payload);
        return response.data;
      }
    },
    onSuccess: () => {
      message.success(editingVol ? 'Vol mis à jour.' : 'Vol enregistré.');
      setIsModalOpen(false);
      setEditingVol(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['admin-vols'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur.');
    },
  });

  // Mutation to delete flight
  const deleteVolMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/vols/${id}`);
    },
    onSuccess: () => {
      message.success('Vol supprimé.');
      queryClient.invalidateQueries({ queryKey: ['admin-vols'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur lors de la suppression.');
    },
  });

  const handleEdit = (record: any) => {
    setEditingVol(record);
    form.setFieldsValue({
      compagnie: record.compagnie,
      numero_vol: record.numero_vol,
      date_depart: dayjs(record.date_depart),
      aeroport_depart: record.aeroport_depart,
      aeroport_arrivee: record.aeroport_arrivee,
      notes: record.notes,
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingVol(null);
    form.resetFields();
    form.setFieldsValue({
      aeroport_depart: 'OUA - Ouagadougou',
      aeroport_arrivee: 'JED - Jeddah',
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Compagnie',
      dataIndex: 'compagnie',
      key: 'compagnie',
      render: (t: string) => <Text strong>{t}</Text>,
    },
    {
      title: 'Numéro de Vol',
      dataIndex: 'numero_vol',
      key: 'numero_vol',
      render: (t: string) => <Tag color="purple">{t}</Tag>,
    },
    {
      title: 'Date de départ',
      dataIndex: 'date_depart',
      key: 'date_depart',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY à HH:mm'),
    },
    {
      title: 'Aéroport Départ',
      dataIndex: 'aeroport_depart',
      key: 'aeroport_depart',
    },
    {
      title: 'Aéroport Arrivée',
      dataIndex: 'aeroport_arrivee',
      key: 'aeroport_arrivee',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="default" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            Modifier
          </Button>
          <Popconfirm title="Supprimer ce vol ?" onConfirm={() => deleteVolMutation.mutate(record.id)} okText="Supprimer" cancelText="Annuler">
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ color: '#1a6b3a', margin: 0 }}>
            <CalendarOutlined /> Gestion des Vols
          </Title>
          <Text type="secondary">Planifiez les vols pour les groupes de pèlerins</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{ backgroundColor: '#1a6b3a', borderColor: '#13522b' }}
          >
            Ajouter un Vol
          </Button>
        </Col>
      </Row>

      <Card style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <Table columns={columns} dataSource={vols} rowKey="id" loading={isLoading} size="middle" />
      </Card>

      {/* Flight Modal Form */}
      <Modal
        title={editingVol ? 'Modifier le Vol' : 'Enregistrer un Vol'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingVol(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={saveVolMutation.mutate}>
          <Form.Item name="compagnie" label="Compagnie Aérienne" rules={[{ required: true, message: 'Requis.' }]}>
            <Input placeholder="Ex: Ethiopian Airlines, Air Burkina..." />
          </Form.Item>

          <Form.Item name="numero_vol" label="Numéro de Vol" rules={[{ required: true, message: 'Requis.' }]}>
            <Input placeholder="Ex: ET-901" />
          </Form.Item>

          <Form.Item name="date_depart" label="Date & Heure de départ" rules={[{ required: true, message: 'Requis.' }]}>
            <DatePicker showTime style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" />
          </Form.Item>

          <Form.Item name="aeroport_depart" label="Aéroport de Départ" rules={[{ required: true, message: 'Requis.' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="aeroport_arrivee" label="Aéroport d'Arrivée" rules={[{ required: true, message: 'Requis.' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="notes" label="Remarques (ex: Escale, Franchise Bagages)">
            <Input.TextArea placeholder="Infos utiles..." rows={2} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button type="primary" htmlType="submit" loading={saveVolMutation.isPending} style={{ backgroundColor: '#1a6b3a' }}>
                Enregistrer
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminVols;
