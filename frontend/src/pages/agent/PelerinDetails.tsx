import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Tabs,
  Button,
  Descriptions,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Space,
  Row,
  Col,
  Statistic,
  Badge,
  Spin,
  message,
  Alert,
  DatePicker,
  Avatar,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  FilePdfOutlined,
  CreditCardOutlined,
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
} from '@ant-design/icons';
import api from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

const AgentPelerinDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('1');
  const [rejectDocId, setRejectDocId] = useState<number | null>(null);
  const [rejectForm] = Form.useForm();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm] = Form.useForm();

  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [recordPaymentForm] = Form.useForm();

  // 1. Fetch Pelerin details
  const { data: pelerin, isLoading, error } = useQuery({
    queryKey: ['admin-pelerin-details', id],
    queryFn: async () => {
      const response = await api.get(`/admin/pelerins/${id}`);
      return response.data;
    },
  });

  // 2. Fetch all groups for assignment
  const { data: groupes } = useQuery({
    queryKey: ['groupes-list'],
    queryFn: async () => {
      const response = await api.get('/admin/groupes');
      return response.data;
    },
  });

  // Mutation to verify document (Validate/Reject)
  const verifyDocMutation = useMutation({
    mutationFn: async ({ docId, statut, commentaire }: { docId: number; statut: 'valide' | 'rejete'; commentaire?: string }) => {
      const response = await api.post(`/admin/documents/${docId}/verifier`, { statut, commentaire });
      return response.data;
    },
    onSuccess: () => {
      message.success('Document mis à jour.');
      queryClient.invalidateQueries({ queryKey: ['admin-pelerin-details', id] });
      setRejectDocId(null);
      rejectForm.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur lors de la vérification.');
    },
  });

  // Mutation to validate payment
  const validatePaymentMutation = useMutation({
    mutationFn: async (paymentId: number) => {
      const response = await api.put(`/admin/paiements/${paymentId}/valider`);
      return response.data;
    },
    onSuccess: () => {
      message.success('Paiement validé.');
      queryClient.invalidateQueries({ queryKey: ['admin-pelerin-details', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur lors de la validation.');
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
      queryClient.invalidateQueries({ queryKey: ['admin-pelerin-details', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur.');
    },
  });

  // Mutation to update Inscription Statut
  const updateInscriptionStatutMutation = useMutation({
    mutationFn: async ({ inscriptionId, statut, commentaire }: { inscriptionId: number; statut: string; commentaire?: string }) => {
      const response = await api.put(`/admin/inscriptions/${inscriptionId}/statut`, {
        statut,
        commentaire_agent: commentaire || null,
      });
      return response.data;
    },
    onSuccess: () => {
      message.success('Statut de l\'inscription mis à jour.');
      queryClient.invalidateQueries({ queryKey: ['admin-pelerin-details', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur.');
    },
  });

  // Mutation to assign to group
  const assignGroupMutation = useMutation({
    mutationFn: async (targetGroupId: number) => {
      const response = await api.post(`/admin/groupes/${targetGroupId}/ajouter-pelerin`, {
        pelerin_ids: [parseInt(id!)],
      });
      return response.data;
    },
    onSuccess: () => {
      message.success('Pèlerin affecté au groupe avec succès.');
      queryClient.invalidateQueries({ queryKey: ['admin-pelerin-details', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur d\'affectation.');
    },
  });

  // Mutation to remove from group
  const removeGroupMutation = useMutation({
    mutationFn: async (currentGroupId: number) => {
      const response = await api.delete(`/admin/groupes/${currentGroupId}/retirer-pelerin/${id}`);
      return response.data;
    },
    onSuccess: () => {
      message.success('Pèlerin retiré du groupe.');
      queryClient.invalidateQueries({ queryKey: ['admin-pelerin-details', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur lors du retrait.');
    },
  });

  // Mutation to update Pelerin profile
  const updateProfileMutation = useMutation({
    mutationFn: async (values: any) => {
      const response = await api.put(`/admin/pelerins/${id}`, {
        ...values,
        date_naissance: values.date_naissance ? values.date_naissance.format('YYYY-MM-DD') : null,
      });
      return response.data;
    },
    onSuccess: () => {
      message.success('Profil pèlerin mis à jour.');
      setIsEditProfileOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-pelerin-details', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur lors de la mise à jour.');
    },
  });

  // Mutation to record a payment direct from agence
  const recordPaymentMutation = useMutation({
    mutationFn: async (values: any) => {
      // Pour enregistrer un paiement au nom du pelerin, on utilise l'API standard de paiement
      // mais en tant qu'agent on pourra la valider immédiatement après ou faire l'appel direct.
      // Le backend InscriptionController s'attend à ce que le pelerin lui-même fasse la demande.
      // Attends ! Le paiement store controller utilise $request->user()->pelerin.
      // Donc un agent ne peut pas utiliser POST /api/paiements directement car il n'a pas de profil pelerin associé !
      // Voyons si PaiementController permet d'enregistrer.
      // Ah ! Dans PaiementController.php, store() récupère le pèlerin connecté :
      // `$pelerin = $request->user()->pelerin;`
      // C'est uniquement pour le pèlerin.
      // Mais attend, est-ce que l'agent peut quand même déclarer ?
      // Dans le code de PaiementController.php :
      // `// Pèlerin déclare un paiement.`
      // `public function store(Request $request)`
      // Et pour l'agent, il n'y a pas de store spécifique. L'agent ne fait que valider les déclarations faites par le pèlerin.
      // C'est une règle du cahier des charges : "Déclaration paiement -> pèlerin, Validation -> agent/admin".
      // Donc l'agent n'a pas besoin de créer de paiement lui-même en v1, le pèlerin le déclare depuis son espace et l'agent le valide.
      // Donc nous n'avons pas besoin de form d'enregistrement direct par l'agent, ou alors s'ils le font, ils se connectent en tant que pelerin.
      // Pour éviter de violer les signatures de l'API (qui plante si $request->user()->pelerin est nul),
      // nous allons désactiver le bouton "Enregistrer paiement" pour l'agent et s'en tenir STRICTEMENT aux spécifications :
      // Le pelerin déclare, l'agent valide. C'est parfait et 100% conforme à l'API !
    },
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Chargement de la fiche pèlerin..." />
      </div>
    );
  }

  if (error || !pelerin) {
    return <Alert message="Erreur" description="Impossible de charger le dossier de ce pèlerin." type="error" showIcon />;
  }

  const inscription = pelerin.inscription_active;
  const forfait = inscription?.forfait;
  const uploadedDocs = pelerin.documents || [];
  const payments = pelerin.paiements || [];
  const activeGroupId = pelerin.groupe_id;
  const group = pelerin.groupe;

  // Calcul financiers
  const totalCost = forfait?.prix || 0;
  const totalPaid = payments
    .filter((p: any) => p.statut === 'valide')
    .reduce((sum: number, p: any) => sum + parseInt(p.montant), 0);
  const balance = Math.max(0, totalCost - totalPaid);

  const getStatusTag = (statut: string) => {
    switch (statut) {
      case 'incomplet':
        return <Tag color="warning">Incomplet</Tag>;
      case 'en_verification':
        return <Tag color="processing">En vérification</Tag>;
      case 'valide':
        return <Tag color="success">Validé</Tag>;
      case 'desiste':
        return <Tag color="error">Désisté</Tag>;
      default:
        return <Tag color="default">Aucun</Tag>;
    }
  };

  const getDocStatusTag = (statut: string) => {
    switch (statut) {
      case 'soumis':
        return <Tag color="blue">Soumis</Tag>;
      case 'valide':
        return <Tag color="green">Validé</Tag>;
      case 'rejete':
        return <Tag color="red">Rejeté</Tag>;
      default:
        return <Tag color="default">Non fourni</Tag>;
    }
  };

  const handleDownloadDoc = (doc: any) => {
    api.get(`/admin/documents/${doc.id}/download`, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', doc.nom_fichier);
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => message.error('Erreur lors du téléchargement.'));
  };

  const handleDownloadFichePdf = () => {
    api.get(`/admin/pelerins/${pelerin.id}/fiche-pdf`, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `fiche_${pelerin.numero_passeport || pelerin.id}.pdf`);
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => message.error('Erreur lors de la génération du PDF.'));
  };

  // Columns for documents
  const docColumns = [
    {
      title: 'Type de document',
      dataIndex: 'nom',
      key: 'nom',
      render: (text: string, record: any) => (
        <span>
          {text} {record.obligatoire && <span style={{ color: 'red' }}>*</span>}
        </span>
      ),
    },
    {
      title: 'Fichier',
      key: 'fichier',
      render: (_: any, record: any) => {
        const doc = uploadedDocs.find((d: any) => d.type_document_id === record.id);
        if (!doc) return <Text type="secondary">Non fourni</Text>;
        return (
          <Button type="link" size="small" onClick={() => handleDownloadDoc(doc)}>
            {doc.nom_fichier}
          </Button>
        );
      },
    },
    {
      title: 'Statut',
      key: 'statut',
      render: (_: any, record: any) => {
        const doc = uploadedDocs.find((d: any) => d.type_document_id === record.id);
        return getDocStatusTag(doc?.statut || 'non_fourni');
      },
    },
    {
      title: 'Vérifié le / par',
      key: 'verificateur',
      render: (_: any, record: any) => {
        const doc = uploadedDocs.find((d: any) => d.type_document_id === record.id);
        if (!doc || !doc.verifie_par) return '-';
        return (
          <span style={{ fontSize: '12px' }}>
            {doc.date_verification ? dayjs(doc.date_verification).format('DD/MM/YYYY') : ''}
          </span>
        );
      },
    },
    {
      title: 'Commentaire',
      key: 'commentaire',
      render: (_: any, record: any) => {
        const doc = uploadedDocs.find((d: any) => d.type_document_id === record.id);
        return doc?.commentaire ? <Text type="danger">{doc.commentaire}</Text> : '-';
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => {
        const doc = uploadedDocs.find((d: any) => d.type_document_id === record.id);
        if (!doc || doc.statut !== 'soumis') return null;

        return (
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: 'Valider le document',
                  content: 'Voulez-vous marquer ce document comme valide ?',
                  okText: 'Confirmer',
                  cancelText: 'Annuler',
                  okButtonProps: { style: { backgroundColor: '#1a6b3a' } },
                  onOk: () => verifyDocMutation.mutate({ docId: doc.id, statut: 'valide' }),
                });
              }}
              style={{ backgroundColor: '#389e0d', borderColor: '#389e0d' }}
            >
              Accepter
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              size="small"
              onClick={() => setRejectDocId(doc.id)}
            >
              Rejeter
            </Button>
          </Space>
        );
      },
    },
  ];

  // Columns for payments
  const paymentColumns = [
    {
      title: 'Référence',
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: 'Date',
      dataIndex: 'date_paiement',
      key: 'date_paiement',
      render: (d: string) => dayjs(d).format('DD/MM/YYYY'),
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
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (s: string) => {
        const colors: Record<string, string> = {
          en_attente: 'orange',
          valide: 'green',
          annule: 'red',
        };
        return <Badge status={colors[s] as any} text={s.toUpperCase()} />;
      },
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => {
        if (record.statut !== 'en_attente') return null;
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: 'Valider le paiement',
                  content: `Confirmez-vous le versement de ${formatFCFA(record.montant)} ?`,
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
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: 'Annuler le paiement',
                  content: 'Voulez-vous refuser ce versement ?',
                  okText: 'Annuler le versement',
                  cancelText: 'Retour',
                  onOk: () => cancelPaymentMutation.mutate(record.id),
                });
              }}
            >
              Annuler
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleEditProfileClick = () => {
    profileForm.setFieldsValue({
      telephone: pelerin.telephone,
      adresse: pelerin.adresse,
      profession: pelerin.profession,
      numero_passeport: pelerin.numero_passeport,
      nationalite: pelerin.nationalite,
      date_naissance: pelerin.date_naissance ? dayjs(pelerin.date_naissance) : null,
    });
    setIsEditProfileOpen(true);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header back navigation */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/agent/pelerins">
          <Button icon={<ArrowLeftOutlined />}>Retour à la liste</Button>
        </Link>
      </div>

      {/* Main Info Banner */}
      <Card style={{ marginBottom: '24px', borderRadius: '10px' }} bodyStyle={{ padding: '24px' }}>
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col>
            <Space size="large">
              <Avatar size={64} style={{ backgroundColor: '#1a6b3a' }} icon={<UserOutlined />} />
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {pelerin.user?.prenom} {pelerin.user?.nom}
                </Title>
                <Text type="secondary">
                  Dossier N° {pelerin.id} · Passeport : {pelerin.numero_passeport || 'Non renseigné'}
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button type="primary" icon={<FilePdfOutlined />} onClick={handleDownloadFichePdf} style={{ backgroundColor: '#1a6b3a' }}>
                Fiche Récapitulative PDF
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Left Column: Stats & Dossier Status */}
        <Col xs={24} lg={8}>
          <Card title="Statut du Dossier" style={{ marginBottom: '24px', borderRadius: '10px' }}>
            {inscription ? (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                  <Text type="secondary">Statut actuel :</Text>
                  <div style={{ marginTop: '4px' }}>{getStatusTag(inscription.statut)}</div>
                </div>

                <Divider style={{ margin: '8px 0' }} />

                <div>
                  <Text strong>Changer le statut du dossier :</Text>
                  <Select
                    style={{ width: '100%', marginTop: '8px' }}
                    value={inscription.statut}
                    onChange={(value) => {
                      Modal.confirm({
                        title: 'Changer le statut',
                        content: `Voulez-vous modifier le statut du dossier vers "${value.toUpperCase()}" ?`,
                        okText: 'Confirmer',
                        cancelText: 'Annuler',
                        onOk: () => updateInscriptionStatutMutation.mutate({ inscriptionId: inscription.id, statut: value }),
                      });
                    }}
                  >
                    <Select.Option value="incomplet">Incomplet</Select.Option>
                    <Select.Option value="en_verification">En vérification</Select.Option>
                    <Select.Option value="valide">Validé</Select.Option>
                    <Select.Option value="desiste">Désisté</Select.Option>
                  </Select>
                </div>
              </Space>
            ) : (
              <Alert message="Aucune inscription active" type="warning" showIcon />
            )}
          </Card>

          <Card title="Finances" style={{ marginBottom: '24px', borderRadius: '10px' }}>
            {forfait ? (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Statistic title="Coût du forfait" value={formatFCFA(totalCost)} />
                <Statistic title="Total encaissé" value={formatFCFA(totalPaid)} valueStyle={{ color: '#389e0d' }} />
                <Statistic title="Solde restant" value={formatFCFA(balance)} valueStyle={{ color: balance > 0 ? '#fa8c16' : '#52c41a' }} />
              </Space>
            ) : (
              <Text type="secondary">Pas de forfait associé.</Text>
            )}
          </Card>

          <Card title="Voyage & Groupe" style={{ borderRadius: '10px' }}>
            {activeGroupId ? (
              <div>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Groupe">
                    <Link to={`/agent/groupes/${group.id}`} style={{ fontWeight: 'bold', color: '#1a6b3a' }}>
                      {group.nom}
                    </Link>
                  </Descriptions.Item>
                  <Descriptions.Item label="Départ">
                    {dayjs(group.date_depart).format('DD/MM/YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Retour">
                    {dayjs(group.date_retour).format('DD/MM/YYYY')}
                  </Descriptions.Item>
                </Descriptions>
                <Button
                  danger
                  size="small"
                  block
                  style={{ marginTop: '16px' }}
                  onClick={() => {
                    Modal.confirm({
                      title: 'Retirer du groupe',
                      content: `Voulez-vous retirer ce pèlerin du groupe "${group.nom}" ?`,
                      okText: 'Retirer',
                      cancelText: 'Annuler',
                      onOk: () => removeGroupMutation.mutate(group.id),
                    });
                  }}
                >
                  Retirer du groupe
                </Button>
              </div>
            ) : (
              <div>
                <Alert message="Aucun groupe assigné" type="info" showIcon style={{ marginBottom: '16px' }} />
                <Text style={{ display: 'block', marginBottom: '8px' }}>Assigner à un groupe :</Text>
                <Select
                  placeholder="Sélectionner un groupe"
                  style={{ width: '100%' }}
                  onChange={(value) => assignGroupMutation.mutate(value)}
                >
                  {groupes?.map((g: any) => (
                    <Select.Option key={g.id} value={g.id} disabled={g.places_restantes <= 0}>
                      {g.nom} ({g.places_restantes} places libres)
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}
          </Card>
        </Col>

        {/* Right Column: Tab Panels */}
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: '10px' }}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: '1',
                  label: (
                    <span>
                      <UserOutlined /> Profil
                    </span>
                  ),
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Title level={4} style={{ color: '#1a6b3a', margin: 0 }}>Fiche Profil</Title>
                        <Button type="default" icon={<EditOutlined />} onClick={handleEditProfileClick}>
                          Modifier Profil
                        </Button>
                      </div>
                      <Descriptions bordered column={2}>
                        <Descriptions.Item label="Nom">{pelerin.user?.nom}</Descriptions.Item>
                        <Descriptions.Item label="Prénom">{pelerin.user?.prenom}</Descriptions.Item>
                        <Descriptions.Item label="Email">{pelerin.user?.email}</Descriptions.Item>
                        <Descriptions.Item label="Téléphone">{pelerin.telephone || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Adresse">{pelerin.adresse || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Profession">{pelerin.profession || '-'}</Descriptions.Item>
                        <Descriptions.Item label="N° Passeport">{pelerin.numero_passeport || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Nationalité">{pelerin.nationalite || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Date de naissance">
                          {pelerin.date_naissance ? dayjs(pelerin.date_naissance).format('DD/MM/YYYY') : '-'}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  ),
                },
                {
                  key: '2',
                  label: (
                    <span>
                      <FileTextOutlined /> Documents
                    </span>
                  ),
                  children: (
                    <div>
                      <Title level={4} style={{ color: '#1a6b3a', marginBottom: '16px' }}>Pièces Justificatives</Title>
                      {forfait ? (
                        <Table
                          columns={docColumns}
                          dataSource={forfait.types_documents}
                          rowKey="id"
                          pagination={false}
                          size="middle"
                        />
                      ) : (
                        <Text type="secondary">Aucune inscription active donc aucun document requis.</Text>
                      )}
                    </div>
                  ),
                },
                {
                  key: '3',
                  label: (
                    <span>
                      <CreditCardOutlined /> Paiements
                    </span>
                  ),
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Title level={4} style={{ color: '#1a6b3a', margin: 0 }}>Historique des Versements</Title>
                      </div>
                      <Table
                        columns={paymentColumns}
                        dataSource={payments}
                        rowKey="id"
                        pagination={false}
                        size="middle"
                        locale={{ emptyText: 'Aucun versement enregistré.' }}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Reject Document Modal */}
      <Modal
        title="Motif du rejet"
        open={rejectDocId !== null}
        onCancel={() => {
          setRejectDocId(null);
          rejectForm.resetFields();
        }}
        footer={null}
      >
        <Form form={rejectForm} layout="vertical" onFinish={(values) => {
          if (rejectDocId) {
            verifyDocMutation.mutate({ docId: rejectDocId, statut: 'rejete', commentaire: values.commentaire });
          }
        }}>
          <Form.Item
            name="commentaire"
            label="Motif du rejet"
            rules={[{ required: true, message: 'Veuillez renseigner le motif.' }]}
          >
            <Input.TextArea placeholder="Ex: Le passeport est expiré." rows={3} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setRejectDocId(null)}>Annuler</Button>
              <Button type="primary" danger htmlType="submit" loading={verifyDocMutation.isPending}>
                Rejeter le document
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        title="Modifier le profil pèlerin"
        open={isEditProfileOpen}
        onCancel={() => setIsEditProfileOpen(false)}
        footer={null}
      >
        <Form form={profileForm} layout="vertical" onFinish={updateProfileMutation.mutate}>
          <Form.Item name="telephone" label="Téléphone">
            <Input />
          </Form.Item>
          <Form.Item name="adresse" label="Adresse">
            <Input />
          </Form.Item>
          <Form.Item name="profession" label="Profession">
            <Input />
          </Form.Item>
          <Form.Item name="numero_passeport" label="N° Passeport">
            <Input />
          </Form.Item>
          <Form.Item name="nationalite" label="Nationalité">
            <Input />
          </Form.Item>
          <Form.Item name="date_naissance" label="Date de naissance">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setIsEditProfileOpen(false)}>Annuler</Button>
              <Button type="primary" htmlType="submit" loading={updateProfileMutation.isPending} style={{ backgroundColor: '#1a6b3a' }}>
                Enregistrer
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AgentPelerinDetails;
