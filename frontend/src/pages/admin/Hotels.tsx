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
  Select,
  Rate,
  Popconfirm,
  message,
  Row,
  Col,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title, Text } = Typography;

const AdminHotels: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingHotel, setEditingHotel] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 1. Fetch hotels
  const { data: hotels, isLoading } = useQuery({
    queryKey: ['admin-hotels'],
    queryFn: async () => {
      const response = await api.get('/admin/hotels');
      return response.data.data || response.data;
    },
  });

  // Mutation to create/update hotel
  const saveHotelMutation = useMutation({
    mutationFn: async (values: any) => {
      if (editingHotel) {
        const response = await api.put(`/admin/hotels/${editingHotel.id}`, values);
        return response.data;
      } else {
        const response = await api.post('/admin/hotels', values);
        return response.data;
      }
    },
    onSuccess: () => {
      message.success(editingHotel ? 'Hôtel mis à jour.' : 'Hôtel enregistré.');
      setIsModalOpen(false);
      setEditingHotel(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['admin-hotels'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur.');
    },
  });

  // Mutation to delete hotel
  const deleteHotelMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/hotels/${id}`);
    },
    onSuccess: () => {
      message.success('Hôtel supprimé.');
      queryClient.invalidateQueries({ queryKey: ['admin-hotels'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur lors de la suppression.');
    },
  });

  const handleEdit = (record: any) => {
    setEditingHotel(record);
    form.setFieldsValue({
      nom: record.nom,
      adresse: record.adresse,
      ville: record.ville,
      etoiles: record.etoiles,
      notes: record.notes,
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingHotel(null);
    form.resetFields();
    form.setFieldsValue({
      ville: 'La Mecque',
      etoiles: 4,
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Nom de l\'Hôtel',
      dataIndex: 'nom',
      key: 'nom',
      render: (t: string) => <Text strong>{t}</Text>,
    },
    {
      title: 'Ville',
      dataIndex: 'ville',
      key: 'ville',
      render: (v: string) => {
        const colors: Record<string, string> = {
          'La Mecque': 'gold',
          'Medine': 'green',
          'Jeddah': 'blue',
        };
        return <Tag color={colors[v] || 'default'}>{v}</Tag>;
      },
    },
    {
      title: 'Classification',
      dataIndex: 'etoiles',
      key: 'etoiles',
      render: (stars: number) => <Rate disabled defaultValue={stars} style={{ fontSize: '14px' }} />,
    },
    {
      title: 'Adresse',
      dataIndex: 'adresse',
      key: 'adresse',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="default" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            Modifier
          </Button>
          <Popconfirm title="Supprimer cet hôtel ?" onConfirm={() => deleteHotelMutation.mutate(record.id)} okText="Supprimer" cancelText="Annuler">
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
            <HomeOutlined /> Gestion des Hôtels
          </Title>
          <Text type="secondary">Gérez les établissements d'hébergements partenaires en Arabie Saoudite</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{ backgroundColor: '#1a6b3a', borderColor: '#13522b' }}
          >
            Ajouter un Hôtel
          </Button>
        </Col>
      </Row>

      <Card style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <Table columns={columns} dataSource={hotels} rowKey="id" loading={isLoading} size="middle" />
      </Card>

      {/* Hotel Modal Form */}
      <Modal
        title={editingHotel ? 'Modifier l\'Hôtel' : 'Enregistrer un Hôtel'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingHotel(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={saveHotelMutation.mutate}>
          <Form.Item name="nom" label="Nom de l'Hôtel" rules={[{ required: true, message: 'Requis.' }]}>
            <Input placeholder="Ex: Swissotel Makkah, Anwar Al Madinah..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ville" label="Ville" rules={[{ required: true, message: 'Requis.' }]}>
                <Select placeholder="Choisir la ville">
                  <Select.Option value="La Mecque">La Mecque</Select.Option>
                  <Select.Option value="Medine">Médine</Select.Option>
                  <Select.Option value="Jeddah">Jeddah</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="etoiles" label="Étoiles (Classification)">
                <Rate style={{ fontSize: '20px', marginTop: '6px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="adresse" label="Adresse physique">
            <Input placeholder="Ex: Abraj Al-Bait, Ajyad Street..." />
          </Form.Item>

          <Form.Item name="notes" label="Remarques (ex: Proximité du Haram, Services inclus)">
            <Input.TextArea placeholder="Infos utiles..." rows={2} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button type="primary" htmlType="submit" loading={saveHotelMutation.isPending} style={{ backgroundColor: '#1a6b3a' }}>
                Enregistrer
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminHotels;
