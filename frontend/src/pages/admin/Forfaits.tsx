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
  message,
  Divider,
  Popconfirm,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CompassOutlined, FileTextOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title, Text } = Typography;

const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

const AdminForfaits: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingForfait, setEditingForfait] = useState<any | null>(null);
  const [isForfaitModalOpen, setIsForfaitModalOpen] = useState(false);
  const [forfaitForm] = Form.useForm();

  // Document modal states
  const [selectedForfaitForDocs, setSelectedForfaitForDocs] = useState<any | null>(null);
  const [editingDocType, setEditingDocType] = useState<any | null>(null);
  const [docTypeForm] = Form.useForm();

  // 1. Fetch all forfaits
  const { data: forfaits, isLoading } = useQuery({
    queryKey: ['admin-forfaits'],
    queryFn: async () => {
      const response = await api.get('/forfaits');
      return response.data;
    },
  });

  // Mutation to create/update forfait
  const saveForfaitMutation = useMutation({
    mutationFn: async (values: any) => {
      if (editingForfait) {
        const response = await api.put(`/forfaits/${editingForfait.id}`, values);
        return response.data;
      } else {
        const response = await api.post('/forfaits', values);
        return response.data;
      }
    },
    onSuccess: () => {
      message.success(editingForfait ? 'Forfait mis à jour.' : 'Forfait créé.');
      setIsForfaitModalOpen(false);
      setEditingForfait(null);
      forfaitForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ['admin-forfaits'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur.');
    },
  });

  // Mutation to delete forfait
  const deleteForfaitMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/forfaits/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      message.success(data.message || 'Forfait supprimé.');
      queryClient.invalidateQueries({ queryKey: ['admin-forfaits'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur lors de la suppression.');
    },
  });

  // Mutation to save document type
  const saveDocTypeMutation = useMutation({
    mutationFn: async (values: any) => {
      if (editingDocType) {
        const response = await api.put(`/types-documents/${editingDocType.id}`, values);
        return response.data;
      } else {
        const response = await api.post(`/forfaits/${selectedForfaitForDocs.id}/types-documents`, values);
        return response.data;
      }
    },
    onSuccess: () => {
      message.success('Document requis enregistré.');
      setEditingDocType(null);
      docTypeForm.resetFields();
      // Invalidate both lists
      queryClient.invalidateQueries({ queryKey: ['admin-forfaits'] });
      // Refresh current forfait docs details
      if (selectedForfaitForDocs) {
        api.get(`/forfaits/${selectedForfaitForDocs.id}`).then((res) => {
          setSelectedForfaitForDocs(res.data);
        });
      }
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur.');
    },
  });

  // Mutation to delete document type
  const deleteDocTypeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/types-documents/${id}`);
      return response.data;
    },
    onSuccess: () => {
      message.success('Document requis supprimé.');
      queryClient.invalidateQueries({ queryKey: ['admin-forfaits'] });
      if (selectedForfaitForDocs) {
        api.get(`/forfaits/${selectedForfaitForDocs.id}`).then((res) => {
          setSelectedForfaitForDocs(res.data);
        });
      }
    },
  });

  const handleEditForfait = (record: any) => {
    setEditingForfait(record);
    forfaitForm.setFieldsValue({
      nom: record.nom,
      type: record.type,
      prix: record.prix,
      duree: record.duree,
      description: record.description,
      services_inclus: record.services_inclus,
      actif: record.actif,
    });
    setIsForfaitModalOpen(true);
  };

  const handleCreateForfait = () => {
    setEditingForfait(null);
    forfaitForm.resetFields();
    forfaitForm.setFieldsValue({ actif: true });
    setIsForfaitModalOpen(true);
  };

  const handleManageDocs = (record: any) => {
    setSelectedForfaitForDocs(record);
    setEditingDocType(null);
    docTypeForm.resetFields();
  };

  const handleEditDocType = (record: any) => {
    setEditingDocType(record);
    docTypeForm.setFieldsValue({
      nom: record.nom,
      obligatoire: record.obligatoire,
      description: record.description,
    });
  };

  // Main columns
  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (t: string) => <Tag color={t === 'hajj' ? 'gold' : 'blue'}>{t.toUpperCase()}</Tag>,
    },
    {
      title: 'Prix',
      dataIndex: 'prix',
      key: 'prix',
      render: (p: number) => formatFCFA(p),
    },
    {
      title: 'Durée (jours)',
      dataIndex: 'duree',
      key: 'duree',
    },
    {
      title: 'Statut',
      dataIndex: 'actif',
      key: 'actif',
      render: (active: boolean) => (active ? <Tag color="green">Actif</Tag> : <Tag color="red">Désactivé</Tag>),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="default" icon={<EditOutlined />} size="small" onClick={() => handleEditForfait(record)}>
            Modifier
          </Button>
          <Button type="default" icon={<FileTextOutlined />} size="small" onClick={() => handleManageDocs(record)}>
            Docs requis ({record.types_documents?.length || 0})
          </Button>
          <Popconfirm
            title="Supprimer le forfait ?"
            description="Si des pèlerins y sont inscrits, le forfait sera seulement désactivé."
            onConfirm={() => deleteForfaitMutation.mutate(record.id)}
            okText="Supprimer"
            cancelText="Annuler"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1250px', margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ color: '#1a6b3a', margin: 0 }}>
            <CompassOutlined /> Gestion des Forfaits
          </Title>
          <Text type="secondary">Définissez les offres Hajj & Omra et associez-y les pièces justificatives requises</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateForfait}
            style={{ backgroundColor: '#1a6b3a', borderColor: '#13522b' }}
          >
            Ajouter un Forfait
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Left Side: Forfaits list */}
        <Col xs={24} lg={selectedForfaitForDocs ? 14 : 24}>
          <Card style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <Table columns={columns} dataSource={forfaits} rowKey="id" loading={isLoading} pagination={false} size="middle" />
          </Card>
        </Col>

        {/* Right Side: Manage required docs for selected forfait */}
        {selectedForfaitForDocs && (
          <Col xs={24} lg={10}>
            <Card
              title={
                <span>
                  <FileTextOutlined style={{ color: '#1a6b3a', marginRight: '6px' }} />
                  Documents requis : {selectedForfaitForDocs.nom}
                </span>
              }
              extra={
                <Button size="small" onClick={() => setSelectedForfaitForDocs(null)}>
                  Fermer
                </Button>
              }
              style={{ borderRadius: '10px', border: '1px solid rgba(26,107,58,0.15)' }}
            >
              <Table
                dataSource={selectedForfaitForDocs.types_documents}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: 'Nom',
                    dataIndex: 'nom',
                    key: 'nom',
                    render: (t: string, r: any) => (
                      <span>
                        {t} {r.obligatoire && <span style={{ color: 'red' }}>*</span>}
                      </span>
                    ),
                  },
                  {
                    title: 'Action',
                    key: 'action',
                    render: (_: any, r: any) => (
                      <Space>
                        <Button type="link" size="small" onClick={() => handleEditDocType(r)}>
                          Éditer
                        </Button>
                        <Popconfirm title="Supprimer ?" onConfirm={() => deleteDocTypeMutation.mutate(r.id)}>
                          <Button type="text" danger size="small">
                            Supprimer
                          </Button>
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
              />

              <Divider style={{ margin: '16px 0' }} />

              <Title level={5}>{editingDocType ? 'Modifier le document' : 'Ajouter un document requis'}</Title>
              <Form form={docTypeForm} layout="vertical" onFinish={saveDocTypeMutation.mutate} size="small" initialValues={{ obligatoire: true }}>
                <Form.Item name="nom" label="Nom du document" rules={[{ required: true, message: 'Requis.' }]}>
                  <Input placeholder="Ex: Copie Passeport, Certificat de vaccination..." />
                </Form.Item>
                <Form.Item name="description" label="Consignes / Description">
                  <Input.TextArea placeholder="Ex: Format PDF ou photo nette, validité > 6 mois." rows={2} />
                </Form.Item>
                <Form.Item name="obligatoire" label="Obligatoire" valuePropName="checked">
                  <Switch checkedChildren="Oui" unCheckedChildren="Non" />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                  <Space>
                    {editingDocType && (
                      <Button
                        onClick={() => {
                          setEditingDocType(null);
                          docTypeForm.resetFields();
                        }}
                      >
                        Annuler
                      </Button>
                    )}
                    <Button type="primary" htmlType="submit" loading={saveDocTypeMutation.isPending} style={{ backgroundColor: '#1a6b3a' }}>
                      Enregistrer
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        )}
      </Row>

      {/* Forfait Modal Form */}
      <Modal
        title={editingForfait ? 'Modifier le Forfait' : 'Créer un Forfait'}
        open={isForfaitModalOpen}
        onCancel={() => {
          setIsForfaitModalOpen(false);
          setEditingForfait(null);
          forfaitForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={forfaitForm} layout="vertical" onFinish={saveForfaitMutation.mutate}>
          <Form.Item name="nom" label="Nom du forfait" rules={[{ required: true, message: 'Requis.' }]}>
            <Input placeholder="Ex: Hajj 2026 Économique" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Type de forfait" rules={[{ required: true, message: 'Requis.' }]}>
                <Select placeholder="Sélectionner le type">
                  <Select.Option value="hajj">Hajj</Select.Option>
                  <Select.Option value="omra">Omra</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="prix" label="Prix (FCFA)" rules={[{ required: true, message: 'Requis.' }]}>
                <Input type="number" suffix="FCFA" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="duree" label="Durée (jours)" rules={[{ required: true, message: 'Requis.' }]}>
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="actif" label="Forfait disponible à l'inscription" valuePropName="checked">
                <Switch checkedChildren="Oui" unCheckedChildren="Non" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description du forfait">
            <Input.TextArea placeholder="Détails de l'offre..." rows={3} />
          </Form.Item>

          <Form.Item name="services_inclus" label="Services inclus (séparés par des virgules)">
            <Input.TextArea placeholder="Ex: Vols, Hôtels, Repas, Assurance..." rows={2} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button
                onClick={() => {
                  setIsForfaitModalOpen(false);
                  setEditingForfait(null);
                }}
              >
                Annuler
              </Button>
              <Button type="primary" htmlType="submit" loading={saveForfaitMutation.isPending} style={{ backgroundColor: '#1a6b3a' }}>
                Créer / Modifier
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminForfaits;
