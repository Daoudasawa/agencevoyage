import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Col,
  Row,
  Button,
  Tag,
  Typography,
  Spin,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Progress,
  Space,
  message,
} from 'antd';
import { TeamOutlined, PlusOutlined, CalendarOutlined, EnvironmentOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const AgentGroupes: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();

  // 1. Fetch groups list
  const { data: groupes, isLoading } = useQuery({
    queryKey: ['groupes-list'],
    queryFn: async () => {
      const response = await api.get('/admin/groupes');
      return response.data;
    },
  });

  // 2. Fetch vols list for dropdown
  const { data: vols } = useQuery({
    queryKey: ['vols-list'],
    queryFn: async () => {
      const response = await api.get('/admin/vols');
      return response.data.data || response.data;
    },
  });

  // 3. Fetch hotels list for selection
  const { data: hotels } = useQuery({
    queryKey: ['hotels-list'],
    queryFn: async () => {
      const response = await api.get('/admin/hotels');
      return response.data.data || response.data;
    },
  });

  // Mutation to create a group
  const createGroupMutation = useMutation({
    mutationFn: async (values: any) => {
      const response = await api.post('/admin/groupes', {
        nom: values.nom,
        vol_id: values.vol_id,
        date_depart: values.date_depart.format('YYYY-MM-DD'),
        date_retour: values.date_retour.format('YYYY-MM-DD'),
        capacite_max: parseInt(values.capacite_max),
        hotel_ids: values.hotel_ids || [],
        notes: values.notes || null,
      });
      return response.data;
    },
    onSuccess: () => {
      message.success('Groupe créé avec succès !');
      setIsCreateModalOpen(false);
      createForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ['groupes-list'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur lors de la création.');
    },
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Chargement des groupes..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ color: '#1a6b3a', margin: 0 }}>
            <TeamOutlined /> Groupes de Voyage
          </Title>
          <Text type="secondary">Gérez les convois de pèlerins, l'affectation des vols et des hôtels</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
            style={{ backgroundColor: '#1a6b3a', borderColor: '#13522b' }}
          >
            Créer un Groupe
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {groupes?.map((groupe: any) => {
          const count = groupe.pelerins_count || 0;
          const max = groupe.capacite_max || 50;
          const percent = Math.min(100, Math.round((count / max) * 100));

          return (
            <Col xs={24} md={12} lg={8} key={groupe.id}>
              <Card
                title={<span style={{ color: '#1a6b3a', fontWeight: 'bold' }}>{groupe.nom}</span>}
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  borderRadius: '10px',
                  border: '1px solid rgba(26,107,58,0.15)',
                }}
                bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Remplissage :</Text>
                    <Progress percent={percent} strokeColor="#1a6b3a" format={() => `${count} / ${max}`} />
                  </div>

                  <Space direction="vertical" style={{ width: '100%', marginBottom: '16px' }} size="small">
                    <div>
                      <CalendarOutlined style={{ color: '#c9a84c', marginRight: '6px' }} />
                      <Text style={{ fontSize: '13px' }}>
                        Du {dayjs(groupe.date_depart).format('DD/MM/YYYY')} au{' '}
                        {dayjs(groupe.date_retour).format('DD/MM/YYYY')}
                      </Text>
                    </div>

                    {groupe.vol && (
                      <div>
                        <Tag color="gold">{groupe.vol.compagnie} ({groupe.vol.numero_vol})</Tag>
                      </div>
                    )}

                    {groupe.hotels && groupe.hotels.length > 0 && (
                      <div style={{ marginTop: '4px' }}>
                        <EnvironmentOutlined style={{ color: '#ff4d4f', marginRight: '6px' }} />
                        <Text style={{ fontSize: '13px' }}>
                          Hôtels : {groupe.hotels.map((h: any) => h.nom).join(', ')}
                        </Text>
                      </div>
                    )}
                  </Space>

                  {groupe.notes && (
                    <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#666', fontSize: '13px' }}>
                      {groupe.notes}
                    </Paragraph>
                  )}
                </div>

                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  block
                  onClick={() => navigate(`/agent/groupes/${groupe.id}`)}
                  style={{
                    backgroundColor: '#1a6b3a',
                    borderColor: '#13522b',
                    fontWeight: 'bold',
                    marginTop: 'auto',
                  }}
                >
                  Voir les Détails & Gérer
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Create Group Modal */}
      <Modal
        title="Créer un nouveau groupe de voyage"
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          createForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={createForm} layout="vertical" onFinish={createGroupMutation.mutate} initialValues={{ capacite_max: 50 }}>
          <Form.Item name="nom" label="Nom du groupe" rules={[{ required: true, message: 'Requis.' }]}>
            <Input placeholder="Ex: Convoi Hajj A - 2026" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date_depart" label="Date de départ" rules={[{ required: true, message: 'Requis.' }]}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date_retour" label="Date de retour" rules={[{ required: true, message: 'Requis.' }]}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="vol_id" label="Affecter un Vol" rules={[{ required: true, message: 'Veuillez lier un vol.' }]}>
                <Select placeholder="Choisir un vol">
                  {vols?.map((v: any) => (
                    <Select.Option key={v.id} value={v.id}>
                      {v.compagnie} - {v.numero_vol} ({dayjs(v.date_depart).format('DD/MM/YYYY')})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="capacite_max"
                label="Capacité maximale"
                rules={[
                  { required: true, message: 'Requis.' },
                  {
                    validator: (_, value) => {
                      if (value && (isNaN(value) || parseInt(value) <= 0)) {
                        return Promise.reject(new Error('Doit être supérieur à 0.'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="hotel_ids" label="Associer des Hôtels">
            <Select mode="multiple" placeholder="Sélectionner les hôtels du séjour">
              {hotels?.map((h: any) => (
                <Select.Option key={h.id} value={h.id}>
                  {h.nom} ({h.ville} - {h.etoiles}★)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Notes additionnelles / Remarques">
            <Input.TextArea placeholder="Ex: Consignes spécifiques, escales, etc." rows={3} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setIsCreateModalOpen(false)}>Annuler</Button>
              <Button type="primary" htmlType="submit" loading={createGroupMutation.isPending} style={{ backgroundColor: '#1a6b3a' }}>
                Créer le groupe
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AgentGroupes;
