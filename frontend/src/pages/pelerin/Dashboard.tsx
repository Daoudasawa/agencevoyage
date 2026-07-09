import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Steps,
  Card,
  Tabs,
  Button,
  Descriptions,
  Table,
  Tag,
  Upload,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Typography,
  Alert,
  Space,
  Row,
  Col,
  Statistic,
  Badge,
  Spin,
  message,
} from 'antd';
import {
  UploadOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  GlobalOutlined,
  UserOutlined,
} from '@ant-design/icons';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

// Formats FCFA currency
const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

const PelerinDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('1');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm] = Form.useForm();

  // Fetch mon dossier
  const {
    data: dossierData,
    isLoading: isDossierLoading,
    error: dossierError,
  } = useQuery({
    queryKey: ['mon-dossier'],
    queryFn: async () => {
      try {
        const response = await api.get('/inscriptions/mon-dossier');
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          return null; // Pas d'inscription active
        }
        throw error;
      }
    },
  });

  // Fetch list of available forfaits (only if no active inscription)
  const { data: forfaitsData, isLoading: isForfaitsLoading } = useQuery({
    queryKey: ['forfaits-disponibles'],
    queryFn: async () => {
      const response = await api.get('/forfaits');
      // Filtre uniquement les forfaits actifs
      return (response.data.data || response.data).filter((f: any) => f.actif);
    },
    enabled: !dossierData,
  });

  // Mutation for Inscription
  const inscriptionMutation = useMutation({
    mutationFn: async (forfaitId: number) => {
      const response = await api.post('/inscriptions', { forfait_id: forfaitId });
      return response.data;
    },
    onSuccess: () => {
      message.success('Inscription initiée avec succès !');
      queryClient.invalidateQueries({ queryKey: ['mon-dossier'] });
      refreshUser();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Erreur lors de l'inscription.";
      message.error(msg);
    },
  });

  // Mutation for Document Upload
  const uploadMutation = useMutation({
    mutationFn: async ({ typeDocId, file }: { typeDocId: number; file: File }) => {
      const formData = new FormData();
      formData.append('type_document_id', typeDocId.toString());
      formData.append('fichier', file);

      const response = await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      message.success('Document téléversé avec succès !');
      queryClient.invalidateQueries({ queryKey: ['mon-dossier'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Erreur lors de l'upload.";
      message.error(msg);
    },
  });

  // Mutation for Payment Declaration
  const paymentMutation = useMutation({
    mutationFn: async (values: any) => {
      const response = await api.post('/paiements', {
        montant: parseInt(values.montant),
        date_paiement: values.date_paiement.format('YYYY-MM-DD'),
        mode_paiement: values.mode_paiement,
        reference: values.reference || null,
        notes: values.notes || null,
      });
      return response.data;
    },
    onSuccess: () => {
      message.success('Paiement déclaré avec succès ! En attente de validation.');
      setIsPaymentModalOpen(false);
      paymentForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ['mon-dossier'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Erreur lors de la déclaration du paiement.';
      message.error(msg);
    },
  });

  if (isDossierLoading || (isForfaitsLoading && !dossierData)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Chargement de votre dossier..." />
      </div>
    );
  }

  // 1. SANS INSCRIPTION ACTIVE
  if (!dossierData) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={2} style={{ color: '#1a6b3a' }}>Bienvenue sur votre espace pèlerin</Title>
          <Paragraph style={{ fontSize: '16px' }}>
            Vous n'avez pas encore d'inscription active pour la saison de pèlerinage en cours.
            Veuillez choisir l'un de nos forfaits ci-dessous pour initier vos démarches.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {forfaitsData?.map((forfait: any) => (
            <Col xs={24} md={12} lg={8} key={forfait.id}>
              <Card
                title={<span style={{ color: '#1a6b3a', fontWeight: 'bold' }}>{forfait.nom}</span>}
                extra={<Tag color={forfait.type === 'hajj' ? 'gold' : 'blue'}>{forfait.type.toUpperCase()}</Tag>}
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  borderRadius: '10px',
                  border: '1px solid rgba(26, 107, 58, 0.15)'
                }}
                bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <Title level={3} style={{ color: '#1a6b3a', margin: '10px 0' }}>
                    {formatFCFA(forfait.prix)}
                  </Title>
                  <Descriptions column={1} size="small" style={{ marginBottom: '16px' }}>
                    <Descriptions.Item label="Durée">{forfait.duree} jours</Descriptions.Item>
                  </Descriptions>
                  <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: '16px' }}>
                    {forfait.description}
                  </Paragraph>
                  {forfait.services_inclus && (
                    <div style={{ marginBottom: '20px' }}>
                      <Text strong style={{ fontSize: '12px' }}>Services inclus :</Text>
                      <Paragraph style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {forfait.services_inclus}
                      </Paragraph>
                    </div>
                  )}
                </div>
                <Button
                  type="primary"
                  block
                  onClick={() => {
                    Modal.confirm({
                      title: `Confirmer votre inscription`,
                      content: `Voulez-vous initier votre inscription au forfait "${forfait.nom}" ?`,
                      okText: 'Confirmer',
                      cancelText: 'Annuler',
                      okButtonProps: { style: { backgroundColor: '#1a6b3a' } },
                      onOk: () => inscriptionMutation.mutate(forfait.id),
                    });
                  }}
                  loading={inscriptionMutation.isPending}
                  style={{
                    backgroundColor: '#1a6b3a',
                    borderColor: '#13522b',
                    fontWeight: 'bold',
                    marginTop: 'auto'
                  }}
                >
                  S'inscrire maintenant
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  // 2. AVEC INSCRIPTION ACTIVE
  const { inscription, solde_restant, total_paye, pelerin } = dossierData;
  const forfait = inscription.forfait;
  const docTypes = forfait.types_documents || [];
  const uploadedDocs = pelerin.documents || [];
  // Lire les paiements depuis pelerin.paiements OU inscription.paiements (selon ce que l'API renvoie)
  const payments = (pelerin.paiements && pelerin.paiements.length > 0)
    ? pelerin.paiements
    : (inscription.paiements || []);
  const groupe = pelerin.groupe;

  // Calcul du step actuel
  // Steps: 0 Inscription -> 1 Documents -> 2 Validé -> 3 Voyage
  let currentStep = 0;
  if (inscription.statut === 'en_verification') {
    currentStep = 1;
  } else if (inscription.statut === 'valide') {
    currentStep = 2;
    if (pelerin.groupe_id) {
      currentStep = 3;
    }
  }

  const stepStatus = inscription.statut === 'desiste' ? 'error' : 'process';

  const getStatusTag = (statut: string) => {
    switch (statut) {
      case 'incomplet':
        return <Tag color="warning" icon={<ExclamationCircleOutlined />}>INCOMPLET</Tag>;
      case 'en_verification':
        return <Tag color="processing" icon={<SyncOutlined spin />}>EN VÉRIFICATION</Tag>;
      case 'valide':
        return <Tag color="success" icon={<CheckCircleOutlined />}>VALIDÉ</Tag>;
      case 'desiste':
        return <Tag color="error" icon={<ExclamationCircleOutlined />}>DÉSISTÉ</Tag>;
      default:
        return <Tag>{statut}</Tag>;
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

  // Colonnes pour la table des documents
  const docColumns = [
    {
      title: 'Document requis',
      dataIndex: 'nom',
      key: 'nom',
      render: (text: string, record: any) => (
        <span>
          {text} {record.obligatoire && <span style={{ color: 'red' }}>*</span>}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Fichier soumis',
      key: 'fichier',
      render: (_: any, record: any) => {
        const doc = uploadedDocs.find((d: any) => d.type_document_id === record.id);
        if (!doc) return <Text type="secondary">Non soumis</Text>;
        return (
          <a
            href={`http://localhost:8000/api/documents/${doc.id}/download`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              e.preventDefault();
              // Téléchargement via notre client API pour injecter le Token d'Auth
              api.get(`/documents/${doc.id}/download`, { responseType: 'blob' })
                .then((response) => {
                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', doc.nom_fichier);
                  document.body.appendChild(link);
                  link.click();
                })
                .catch(() => message.error('Erreur lors du téléchargement du fichier.'));
            }}
          >
            {doc.nom_fichier}
          </a>
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
      title: 'Commentaire Agent',
      key: 'commentaire',
      render: (_: any, record: any) => {
        const doc = uploadedDocs.find((d: any) => d.type_document_id === record.id);
        return doc?.commentaire ? <Text type="danger">{doc.commentaire}</Text> : '-';
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => {
        const doc = uploadedDocs.find((d: any) => d.type_document_id === record.id);
        const canUpload = !doc || doc.statut === 'rejete';

        if (!canUpload) return null;

        return (
          <Upload
            beforeUpload={(file) => {
              uploadMutation.mutate({ typeDocId: record.id, file });
              return false; // Prevent auto upload by antd
            }}
            showUploadList={false}
            accept=".pdf,.jpg,.jpeg,.png"
          >
            <Button
              icon={<UploadOutlined />}
              size="small"
              loading={uploadMutation.isPending}
            >
              {doc?.statut === 'rejete' ? 'Soumettre à nouveau' : 'Téléverser'}
            </Button>
          </Upload>
        );
      },
    },
  ];

  // Colonnes pour la table des paiements
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
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
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
          virement: 'Virement bancaire',
        };
        return labels[mode] || mode;
      },
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
        const labels: Record<string, string> = {
          en_attente: 'En attente',
          valide: 'Validé',
          annule: 'Annulé',
        };
        return <Badge status={colors[s] as any} text={labels[s]} />;
      },
    },
    {
      title: 'Notes / Justificatif',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Reçu PDF',
      key: 'recu',
      render: (_: any, record: any) => {
        if (record.statut !== 'valide') return '-';
        return (
          <Button
            type="link"
            size="small"
            onClick={() => {
              // Télécharger le PDF reçu de paiement
              api.get(`/paiements/${record.id}/recu`, { responseType: 'blob' })
                .then((response) => {
                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `recu_${record.reference}.pdf`);
                  document.body.appendChild(link);
                  link.click();
                })
                .catch(() => message.error('Erreur lors du téléchargement du reçu PDF.'));
            }}
          >
            Télécharger le reçu
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Banner */}
      <Card
        style={{
          background: 'linear-gradient(90deg, #0d2b18 0%, #1a6b3a 100%)',
          color: '#white',
          marginBottom: '24px',
          borderRadius: '10px',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={3} style={{ color: '#fff', margin: 0 }}>
              {forfait.nom}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>
              Pèlerinage : {forfait.type === 'hajj' ? 'Hajj' : 'Omra'} · Inscription du{' '}
              {dayjs(inscription.date_inscription).format('DD MMMM YYYY')}
            </Text>
          </Col>
          <Col style={{ marginTop: '10px' }}>
            <Space>
              <span style={{ color: '#fff', marginRight: '8px' }}>Statut du dossier :</span>
              {getStatusTag(inscription.statut)}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Progress Steps */}
      <Card style={{ marginBottom: '24px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Steps
          current={currentStep}
          status={stepStatus as any}
          items={[
            { title: 'Inscription', description: 'Formulaire initié' },
            { title: 'Documents', description: 'Téléversement requis' },
            { title: 'Validation', description: 'Validation & Paiement' },
            { title: 'Départ', description: 'Groupe assigné' },
          ]}
        />
      </Card>

      {/* Main content grid */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={18}>
          <Card style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: '1',
                  label: (
                    <span>
                      <UserOutlined /> Dossier & Profil
                    </span>
                  ),
                  children: (
                    <div>
                      <Title level={4} style={{ color: '#1a6b3a', marginBottom: '16px' }}>
                        Vos Informations Personnelles
                      </Title>
                      <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
                        <Descriptions.Item label="Nom">{user?.nom}</Descriptions.Item>
                        <Descriptions.Item label="Prénom">{user?.prenom}</Descriptions.Item>
                        <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
                        <Descriptions.Item label="Téléphone">{pelerin.telephone || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Adresse">{pelerin.adresse || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Profession">{pelerin.profession || '-'}</Descriptions.Item>
                        <Descriptions.Item label="N° Passeport">
                          <Text strong>{pelerin.numero_passeport || '-'}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Nationalité">{pelerin.nationalite || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Date de naissance">
                          {pelerin.date_naissance ? dayjs(pelerin.date_naissance).format('DD/MM/YYYY') : '-'}
                        </Descriptions.Item>
                      </Descriptions>

                      {(!pelerin.numero_passeport || !pelerin.telephone) && (
                        <Alert
                          message="Informations manquantes"
                          description="Certaines informations obligatoires (numéro de passeport, etc.) ne sont pas encore renseignées. Veuillez vous présenter à l'agence ou transmettre ces détails à un agent pour finaliser votre dossier."
                          type="warning"
                          showIcon
                          style={{ marginTop: '20px' }}
                        />
                      )}
                    </div>
                  ),
                },
                {
                  key: '2',
                  label: (
                    <span>
                      <FileTextOutlined /> Pièces Justificatives
                    </span>
                  ),
                  children: (
                    <div>
                      <Title level={4} style={{ color: '#1a6b3a', marginBottom: '16px' }}>
                        Documents obligatoires à fournir
                      </Title>
                      <Alert
                        message="Instructions d'envoi"
                        description="Veuillez téléverser des fichiers au format PDF, JPG ou PNG (maximum 5 Mo). Un agent de l'agence vérifiera et validera chaque document."
                        type="info"
                        showIcon
                        style={{ marginBottom: '20px' }}
                      />
                      <Table
                        columns={docColumns}
                        dataSource={docTypes}
                        rowKey="id"
                        pagination={false}
                        size="middle"
                      />
                    </div>
                  ),
                },
                {
                  key: '3',
                  label: (
                    <span>
                      <CreditCardOutlined /> Suivi Financier
                    </span>
                  ),
                  children: (
                    <div>
                      <Row gutter={16} style={{ marginBottom: '24px' }}>
                        <Col xs={24} sm={8}>
                          <Card bodyStyle={{ padding: '16px' }} style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                            <Statistic title="Coût du Forfait" value={formatFCFA(forfait.prix)} valueStyle={{ color: '#389e0d' }} />
                          </Card>
                        </Col>
                        <Col xs={24} sm={8} style={{ marginTop: '12px' }}>
                          <Card bodyStyle={{ padding: '16px' }} style={{ background: '#f9f0ff', border: '1px solid #d3adf7' }}>
                            <Statistic title="Total Encaissé" value={formatFCFA(total_paye)} valueStyle={{ color: '#722ed1' }} />
                          </Card>
                        </Col>
                        <Col xs={24} sm={8} style={{ marginTop: '12px' }}>
                          <Card
                            bodyStyle={{ padding: '16px' }}
                            style={{
                              background: solde_restant === 0 ? '#f6ffed' : '#fffbe6',
                              border: solde_restant === 0 ? '1px solid #b7eb8f' : '1px solid #ffe58f',
                            }}
                          >
                            <Statistic
                              title="Reste à Payer"
                              value={formatFCFA(solde_restant)}
                              valueStyle={{ color: solde_restant === 0 ? '#389e0d' : '#d46b08' }}
                            />
                          </Card>
                        </Col>
                      </Row>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Title level={4} style={{ color: '#1a6b3a', margin: 0 }}>
                          Historique des Paiements
                        </Title>
                        {solde_restant > 0 && (
                          <Button
                            type="primary"
                            icon={<CreditCardOutlined />}
                            onClick={() => setIsPaymentModalOpen(true)}
                            style={{ backgroundColor: '#1a6b3a' }}
                          >
                            Déclarer un versement
                          </Button>
                        )}
                      </div>

                      <Table
                        columns={paymentColumns}
                        dataSource={payments}
                        rowKey="id"
                        pagination={false}
                        size="middle"
                        locale={{ emptyText: 'Aucun paiement déclaré pour le moment.' }}
                      />
                    </div>
                  ),
                },
                {
                  key: '4',
                  label: (
                    <span>
                      <TeamOutlined /> Voyage & Groupe
                    </span>
                  ),
                  children: (
                    <div>
                      {groupe ? (
                        <div>
                          <Title level={4} style={{ color: '#1a6b3a', marginBottom: '16px' }}>
                            Votre groupe de voyage
                          </Title>
                          <Descriptions bordered column={1} style={{ marginBottom: '24px' }}>
                            <Descriptions.Item label="Nom du Groupe">
                              <Text strong style={{ color: '#1a6b3a' }}>{groupe.nom}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Période du Voyage">
                              Du {dayjs(groupe.date_depart).format('DD/MM/YYYY')} au{' '}
                              {dayjs(groupe.date_retour).format('DD/MM/YYYY')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Remarques Groupe">{groupe.notes || '-'}</Descriptions.Item>
                          </Descriptions>

                          {groupe.vol && (
                            <div style={{ marginBottom: '24px' }}>
                              <Title level={5} style={{ color: '#1a6b3a' }}>
                                <CalendarOutlined /> Informations Vol
                              </Title>
                              <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                                <Descriptions.Item label="Compagnie">{groupe.vol.compagnie}</Descriptions.Item>
                                <Descriptions.Item label="Numéro de vol">{groupe.vol.numero_vol}</Descriptions.Item>
                                <Descriptions.Item label="Date & Heure départ">
                                  {dayjs(groupe.vol.date_depart).format('DD/MM/YYYY à HH:mm')}
                                </Descriptions.Item>
                                <Descriptions.Item label="Itinéraire">
                                  {groupe.vol.aeroport_depart} ➔ {groupe.vol.aeroport_arrivee}
                                </Descriptions.Item>
                              </Descriptions>
                            </div>
                          )}

                          {groupe.hotels && groupe.hotels.length > 0 && (
                            <div>
                              <Title level={5} style={{ color: '#1a6b3a' }}>
                                <EnvironmentOutlined /> Hébergements
                              </Title>
                              <Row gutter={[16, 16]}>
                                {groupe.hotels.map((hotel: any) => (
                                  <Col xs={24} sm={12} key={hotel.id}>
                                    <Card
                                      title={hotel.nom}
                                      size="small"
                                      extra={
                                        <span style={{ color: '#fadb14' }}>
                                          {'★'.repeat(hotel.etoiles)}
                                          {'☆'.repeat(5 - hotel.etoiles)}
                                        </span>
                                      }
                                      style={{ border: '1px solid rgba(26,107,58,0.15)' }}
                                    >
                                      <p>
                                        <GlobalOutlined /> Ville : {hotel.ville}
                                      </p>
                                      {hotel.adresse && <p>Adresse : {hotel.adresse}</p>}
                                      {hotel.notes && <Paragraph style={{ fontSize: '12px', color: '#666' }}>{hotel.notes}</Paragraph>}
                                    </Card>
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Alert
                          message="Groupe non encore assigné"
                          description="Vous n'avez pas encore été affecté à un groupe de voyage. L'affectation s'effectue automatiquement par les agents de l'agence une fois que votre dossier est complet et validé."
                          type="info"
                          showIcon
                        />
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* Sidebar Info Card */}
        <Col xs={24} lg={6}>
          <Card
            title={<span style={{ color: '#1a6b3a' }}>Forfait Choisi</span>}
            style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: '100%' }}
          >
            <Title level={4} style={{ margin: 0, color: '#1a6b3a' }}>
              {forfait.nom}
            </Title>
            <Descriptions column={1} size="small" style={{ marginTop: '16px' }}>
              <Descriptions.Item label="Prix">{formatFCFA(forfait.prix)}</Descriptions.Item>
              <Descriptions.Item label="Durée">{forfait.duree} jours</Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color={forfait.type === 'hajj' ? 'gold' : 'blue'}>{forfait.type.toUpperCase()}</Tag>
              </Descriptions.Item>
            </Descriptions>
            {inscription.commentaire_agent && (
              <div style={{ marginTop: '16px', padding: '12px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '4px' }}>
                <Text strong style={{ fontSize: '12px', color: '#d46b08' }}>Commentaire de l'agence :</Text>
                <Paragraph style={{ margin: '4px 0 0 0', fontSize: '12px' }}>{inscription.commentaire_agent}</Paragraph>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Payment Declaration Modal */}
      <Modal
        title="Déclarer un versement"
        open={isPaymentModalOpen}
        onCancel={() => {
          setIsPaymentModalOpen(false);
          paymentForm.resetFields();
        }}
        footer={null}
      >
        <Form form={paymentForm} layout="vertical" onFinish={paymentMutation.mutate} initialValues={{ date_paiement: dayjs() }}>
          <Form.Item
            name="montant"
            label="Montant (FCFA)"
            rules={[
              { required: true, message: 'Veuillez renseigner le montant.' },
              {
                validator: (_, value) => {
                  if (value && (isNaN(value) || parseInt(value) <= 0)) {
                    return Promise.reject(new Error('Le montant doit être un entier positif.'));
                  }
                  if (value && parseInt(value) > solde_restant) {
                    return Promise.reject(new Error(`Le montant ne peut pas dépasser le solde restant (${formatFCFA(solde_restant)}).`));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" placeholder="Ex: 500000" suffix="FCFA" />
          </Form.Item>

          <Form.Item name="date_paiement" label="Date du versement" rules={[{ required: true, message: 'Veuillez saisir la date.' }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" maxDate={dayjs()} />
          </Form.Item>

          <Form.Item name="mode_paiement" label="Mode de paiement" rules={[{ required: true, message: 'Veuillez choisir le mode.' }]}>
            <Select placeholder="Sélectionner le mode">
              <Select.Option value="especes">Espèces</Select.Option>
              <Select.Option value="orange_money">Orange Money</Select.Option>
              <Select.Option value="moov_money">Moov Money</Select.Option>
              <Select.Option value="virement">Virement bancaire</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="reference" label="Référence de transaction / reçu bancaire" help="Optionnel pour les espèces. Recommandé pour OM/Moov/Virement.">
            <Input placeholder="Ex: TX-98246-A" />
          </Form.Item>

          <Form.Item name="notes" label="Notes additionnelles">
            <Input.TextArea placeholder="Indiquez toute note utile..." rows={2} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setIsPaymentModalOpen(false)}>Annuler</Button>
              <Button type="primary" htmlType="submit" loading={paymentMutation.isPending} style={{ backgroundColor: '#1a6b3a' }}>
                Soumettre la déclaration
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PelerinDashboard;
