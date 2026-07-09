import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  Card,
  Button,
  Tag,
  Typography,
  Space,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  Input,
  Badge,
  Spin,
  message,
  Divider,
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  FileSearchOutlined,
  CreditCardOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

const AgentDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [rejectDocId, setRejectDocId] = useState<number | null>(null);
  const [rejectForm] = Form.useForm();

  // 1. Fetch pending documents
  const { data: pendingDocsData, isLoading: isDocsLoading } = useQuery({
    queryKey: ['pending-documents'],
    queryFn: async () => {
      const response = await api.get('/admin/documents?statut=soumis');
      return response.data.data || response.data;
    },
  });

  // 2. Fetch pending payments
  const { data: pendingPaymentsData, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ['pending-payments'],
    queryFn: async () => {
      const response = await api.get('/admin/paiements?statut=en_attente');
      return response.data.data || response.data;
    },
  });

  // 3. Fetch total counts (by loading lists to count them in v1)
  const { data: pelerinsCount } = useQuery({
    queryKey: ['pelerins-count'],
    queryFn: async () => {
      const response = await api.get('/admin/pelerins');
      return response.data.total || response.data.length || 0;
    },
  });

  const { data: groupesCount } = useQuery({
    queryKey: ['groupes-count'],
    queryFn: async () => {
      const response = await api.get('/admin/groupes');
      return response.data.length || 0;
    },
  });

  // Mutation to verify document
  const verifyDocMutation = useMutation({
    mutationFn: async ({ docId, statut, commentaire }: { docId: number; statut: 'valide' | 'rejete'; commentaire?: string }) => {
      const response = await api.post(`/admin/documents/${docId}/verifier`, { statut, commentaire });
      return response.data;
    },
    onSuccess: () => {
      message.success('Statut du document mis à jour avec succès.');
      queryClient.invalidateQueries({ queryKey: ['pending-documents'] });
      setRejectDocId(null);
      rejectForm.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur lors de la mise à jour.');
    },
  });

  // Mutation to validate payment
  const validatePaymentMutation = useMutation({
    mutationFn: async (paymentId: number) => {
      const response = await api.put(`/admin/paiements/${paymentId}/valider`);
      return response.data;
    },
    onSuccess: () => {
      message.success('Paiement validé avec succès.');
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur lors de la validation du paiement.');
    },
  });

  // Mutation to cancel payment
  const cancelPaymentMutation = useMutation({
    mutationFn: async (paymentId: number) => {
      const response = await api.put(`/admin/paiements/${paymentId}/annuler`);
      return response.data;
    },
    onSuccess: () => {
      message.success('Paiement annulé.');
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur lors de l\'annulation.');
    },
  });

  if (isDocsLoading || isPaymentsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Chargement de vos tâches..." />
      </div>
    );
  }

  // Handle document rejection modal submission
  const handleRejectSubmit = (values: any) => {
    if (rejectDocId) {
      verifyDocMutation.mutate({
        docId: rejectDocId,
        statut: 'rejete',
        commentaire: values.commentaire,
      });
    }
  };

  // Helper to trigger file download via authentication token
  const handleDownload = (doc: any) => {
    api.get(`/admin/documents/${doc.id}/download`, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', doc.nom_fichier);
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => message.error('Erreur lors du téléchargement du fichier.'));
  };

  // Document table columns
  const docColumns = [
    {
      title: 'Pèlerin',
      key: 'pelerin',
      render: (_: any, record: any) => (
        <Link to={`/agent/pelerins/${record.pelerin_id}`} style={{ fontWeight: 'bold' }}>
          {record.pelerin?.user?.prenom} {record.pelerin?.user?.nom}
        </Link>
      ),
    },
    {
      title: 'Type de document',
      dataIndex: ['type_document', 'nom'],
      key: 'type_document',
    },
    {
      title: 'Fichier',
      key: 'fichier',
      render: (_: any, record: any) => (
        <Button type="link" size="small" onClick={() => handleDownload(record)}>
          {record.nom_fichier}
        </Button>
      ),
    },
    {
      title: 'Date de dépôt',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY à HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            size="small"
            onClick={() => {
              Modal.confirm({
                title: 'Valider le document',
                content: 'Êtes-vous sûr de vouloir valider ce document ?',
                okText: 'Valider',
                cancelText: 'Annuler',
                okButtonProps: { style: { backgroundColor: '#1a6b3a' } },
                onOk: () => verifyDocMutation.mutate({ docId: record.id, statut: 'valide' }),
              });
            }}
            style={{ backgroundColor: '#389e0d', borderColor: '#389e0d' }}
          />
          <Button
            danger
            icon={<CloseOutlined />}
            size="small"
            onClick={() => setRejectDocId(record.id)}
          />
        </Space>
      ),
    },
  ];

  // Payment table columns
  const paymentColumns = [
    {
      title: 'Pèlerin',
      key: 'pelerin',
      render: (_: any, record: any) => (
        <Link to={`/agent/pelerins/${record.pelerin_id}`} style={{ fontWeight: 'bold' }}>
          {record.pelerin?.user?.prenom} {record.pelerin?.user?.nom}
        </Link>
      ),
    },
    {
      title: 'Montant',
      dataIndex: 'montant',
      key: 'montant',
      render: (m: number) => formatFCFA(m),
    },
    {
      title: 'Mode',
      dataIndex: 'mode_paiement',
      key: 'mode_paiement',
      render: (mode: string) => {
        const labels: Record<string, string> = {
          especes: 'Espèces',
          orange_money: 'Orange Money',
          moov_money: 'Moov Money',
          virement: 'Virement',
        };
        return labels[mode] || mode;
      },
    },
    {
      title: 'Référence',
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: 'Date versement',
      dataIndex: 'date_paiement',
      key: 'date_paiement',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            size="small"
            onClick={() => {
              Modal.confirm({
                title: 'Valider le paiement',
                content: `Confirmez-vous la réception de la somme de ${formatFCFA(record.montant)} ?`,
                okText: 'Confirmer',
                cancelText: 'Annuler',
                okButtonProps: { style: { backgroundColor: '#1a6b3a' } },
                onOk: () => validatePaymentMutation.mutate(record.id),
              });
            }}
            style={{ backgroundColor: '#1a6b3a', borderColor: '#13522b' }}
          >
            Valider
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            size="small"
            onClick={() => {
              Modal.confirm({
                title: 'Annuler le paiement',
                content: 'Voulez-vous rejeter et annuler cette déclaration de paiement ?',
                okText: 'Rejeter',
                cancelText: 'Annuler',
                onOk: () => cancelPaymentMutation.mutate(record.id),
              });
            }}
          >
            Rejeter
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ color: '#1a6b3a', margin: 0 }}>
          Espace d'Administration Agent
        </Title>
        <Text type="secondary">Suivi des tâches courantes de l'agence</Text>
      </div>

      {/* Summary Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <Statistic
              title="Pèlerins Inscrits"
              value={pelerinsCount}
              prefix={<UserOutlined style={{ color: '#1a6b3a' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <Statistic
              title="Documents à valider"
              value={pendingDocsData?.length || 0}
              valueStyle={{ color: (pendingDocsData?.length || 0) > 0 ? '#fa8c16' : '#52c41a' }}
              prefix={<FileSearchOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <Statistic
              title="Paiements en attente"
              value={pendingPaymentsData?.length || 0}
              valueStyle={{ color: (pendingPaymentsData?.length || 0) > 0 ? '#fa8c16' : '#52c41a' }}
              prefix={<CreditCardOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <Statistic
              title="Groupes Actifs"
              value={groupesCount}
              prefix={<TeamOutlined style={{ color: '#c9a84c' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Documents pending validation */}
      <Card
        title={
          <span>
            <FileSearchOutlined style={{ color: '#fa8c16', marginRight: '8px' }} />
            Documents en attente de vérification
          </span>
        }
        extra={<Badge count={pendingDocsData?.length || 0} style={{ backgroundColor: '#fa8c16' }} />}
        style={{ marginBottom: '32px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}
      >
        <Table
          columns={docColumns}
          dataSource={pendingDocsData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          size="middle"
          locale={{ emptyText: 'Aucun document en attente de vérification.' }}
        />
      </Card>

      {/* Payments pending validation */}
      <Card
        title={
          <span>
            <CreditCardOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
            Déclarations de paiement en attente de validation
          </span>
        }
        extra={<Badge count={pendingPaymentsData?.length || 0} style={{ backgroundColor: '#1890ff' }} />}
        style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}
      >
        <Table
          columns={paymentColumns}
          dataSource={pendingPaymentsData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          size="middle"
          locale={{ emptyText: 'Aucune déclaration de paiement en attente.' }}
        />
      </Card>

      {/* Rejection Modal for Document */}
      <Modal
        title="Motif du rejet du document"
        open={rejectDocId !== null}
        onCancel={() => {
          setRejectDocId(null);
          rejectForm.resetFields();
        }}
        footer={null}
      >
        <Form form={rejectForm} layout="vertical" onFinish={handleRejectSubmit}>
          <Form.Item
            name="commentaire"
            label="Pourquoi refusez-vous ce document ?"
            rules={[{ required: true, message: 'Veuillez saisir un commentaire expliquant le motif du rejet.' }]}
          >
            <Input.TextArea placeholder="Ex: Le fichier est illisible ou tronqué. Veuillez renvoyer une copie nette." rows={4} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setRejectDocId(null)}>Annuler</Button>
              <Button type="primary" danger htmlType="submit" loading={verifyDocMutation.isPending}>
                Confirmer le rejet
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AgentDashboard;
