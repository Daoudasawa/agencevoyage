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
  Typography,
  Space,
  Row,
  Col,
  Progress,
  message,
  Spin,
  Alert,
  Modal,
} from 'antd';
import {
  ArrowLeftOutlined,
  FilePdfOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UserAddOutlined,
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

const AgentGroupeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedPelerinIds, setSelectedPelerinIds] = useState<React.Key[]>([]);

  // 1. Fetch Group details
  const { data: groupe, isLoading: isGroupLoading } = useQuery({
    queryKey: ['admin-groupe-details', id],
    queryFn: async () => {
      const response = await api.get(`/admin/groupes/${id}`);
      return response.data;
    },
  });

  // 2. Fetch all pelerins to find those without groups
  const { data: allPelerinsData, isLoading: isPelerinsLoading } = useQuery({
    queryKey: ['all-pelerins-list'],
    queryFn: async () => {
      const response = await api.get('/admin/pelerins');
      return response.data.data || response.data || [];
    },
  });

  // Mutation to add pelerins to group
  const addPelerinsMutation = useMutation({
    mutationFn: async (pelerinIds: number[]) => {
      const response = await api.post(`/admin/groupes/${id}/ajouter-pelerin`, {
        pelerin_ids: pelerinIds,
      });
      return response.data;
    },
    onSuccess: () => {
      message.success('Pèlerin(s) ajouté(s) au groupe avec succès.');
      setSelectedPelerinIds([]);
      queryClient.invalidateQueries({ queryKey: ['admin-groupe-details', id] });
      queryClient.invalidateQueries({ queryKey: ['all-pelerins-list'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur lors de l\'ajout.');
    },
  });

  // Mutation to remove pelerin from group
  const removePelerinMutation = useMutation({
    mutationFn: async (pelerinId: number) => {
      const response = await api.delete(`/admin/groupes/${id}/retirer-pelerin/${pelerinId}`);
      return response.data;
    },
    onSuccess: () => {
      message.success('Pèlerin retiré du groupe.');
      queryClient.invalidateQueries({ queryKey: ['admin-groupe-details', id] });
      queryClient.invalidateQueries({ queryKey: ['all-pelerins-list'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erreur lors du retrait.');
    },
  });

  if (isGroupLoading || isPelerinsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Chargement des détails du groupe..." />
      </div>
    );
  }

  if (!groupe) {
    return <Alert message="Erreur" description="Impossible de charger le groupe." type="error" showIcon />;
  }

  const pelerins = groupe.pelerins || [];
  const maxCapacity = groupe.capacite_max || 50;
  const currentCount = pelerins.length;
  const placesLeft = Math.max(0, maxCapacity - currentCount);
  const percent = Math.min(100, Math.round((currentCount / maxCapacity) * 100));

  // Filtrer les pèlerins sans groupe ET ayant une inscription active
  const unassignedPelerins = allPelerinsData.filter(
    (p: any) => !p.groupe_id && p.inscription_active && p.inscription_active.statut !== 'desiste'
  );

  const handleDownloadEmargementPdf = () => {
    api.get(`/admin/groupes/${groupe.id}/emargement`, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `emargement_${groupe.nom}.pdf`);
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => message.error('Erreur de téléchargement du PDF.'));
  };

  const handleAddSelected = () => {
    if (selectedPelerinIds.length === 0) return;
    if (selectedPelerinIds.length > placesLeft) {
      message.error(`Capacité insuffisante. Seulement ${placesLeft} places restantes.`);
      return;
    }
    addPelerinsMutation.mutate(selectedPelerinIds.map((id) => parseInt(id.toString())));
  };

  // Columns for assigned pelerins
  const memberColumns = [
    {
      title: 'Pèlerin',
      key: 'nom',
      render: (_: any, record: any) => (
        <Link to={`/agent/pelerins/${record.id}`} style={{ fontWeight: 'bold' }}>
          {record.user?.prenom} {record.user?.nom}
        </Link>
      ),
    },
    {
      title: 'N° Passeport',
      dataIndex: 'numero_passeport',
      key: 'numero_passeport',
      render: (p: string) => p || '-',
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephone',
      key: 'telephone',
      render: (t: string) => t || '-',
    },
    {
      title: 'Forfait',
      key: 'forfait',
      render: (_: any, record: any) => {
        const forfait = record.inscription_active?.forfait;
        return forfait ? forfait.nom : '-';
      },
    },
    {
      title: 'Solde Financier',
      key: 'solde',
      render: (_: any, record: any) => {
        const status = record.inscription_active?.statut;
        return status === 'valide' ? <Tag color="success">Soldé</Tag> : <Tag color="warning">Non soldé</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          danger
          type="text"
          icon={<MinusCircleOutlined />}
          onClick={() => {
            Modal.confirm({
              title: 'Retirer du groupe',
              content: `Voulez-vous retirer "${record.user?.prenom} ${record.user?.nom}" de ce groupe ?`,
              okText: 'Confirmer',
              cancelText: 'Annuler',
              onOk: () => removePelerinMutation.mutate(record.id),
            });
          }}
        >
          Retirer
        </Button>
      ),
    },
  ];

  // Columns for adding unassigned pelerins
  const unassignedColumns = [
    {
      title: 'Pèlerin',
      key: 'nom',
      render: (_: any, record: any) => (
        <span style={{ fontWeight: 'bold' }}>
          {record.user?.prenom} {record.user?.nom}
        </span>
      ),
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: 'Forfait choisi',
      key: 'forfait',
      render: (_: any, record: any) => record.inscription_active?.forfait?.nom || '-',
    },
    {
      title: 'Statut Dossier',
      key: 'statut',
      render: (_: any, record: any) => {
        const statut = record.inscription_active?.statut;
        const colors: Record<string, string> = {
          incomplet: 'orange',
          en_verification: 'blue',
          valide: 'green',
        };
        return <Tag color={colors[statut] || 'default'}>{statut.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/agent/groupes">
          <Button icon={<ArrowLeftOutlined />}>Retour aux groupes</Button>
        </Link>
      </div>

      {/* Main Info Header */}
      <Card style={{ marginBottom: '24px', borderRadius: '10px' }}>
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col>
            <Title level={3} style={{ margin: 0, color: '#1a6b3a' }}>
              {groupe.nom}
            </Title>
            <Text type="secondary">
              Période : Du {dayjs(groupe.date_depart).format('DD/MM/YYYY')} au{' '}
              {dayjs(groupe.date_retour).format('DD/MM/YYYY')}
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={handleDownloadEmargementPdf}
              disabled={pelerins.length === 0}
              style={{ backgroundColor: '#1a6b3a' }}
            >
              Liste d'Émargement PDF
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Left Column: Vol & Hôtels details */}
        <Col xs={24} lg={8}>
          <Card title="Logistique du Convoi" style={{ marginBottom: '24px', borderRadius: '10px' }}>
            <div style={{ marginBottom: '20px' }}>
              <Text type="secondary">Remplissage du groupe :</Text>
              <Progress percent={percent} strokeColor="#1a6b3a" format={() => `${currentCount} / ${maxCapacity} places`} style={{ marginTop: '8px' }} />
              <div style={{ marginTop: '8px', fontSize: '13px' }}>
                <Text strong>{placesLeft}</Text> places restantes libres.
              </div>
            </div>

            {groupe.vol && (
              <div style={{ marginTop: '16px' }}>
                <Title level={5} style={{ color: '#1a6b3a' }}>
                  <CalendarOutlined style={{ marginRight: '6px' }} /> Transport Aérien
                </Title>
                <Descriptions column={1} size="small" bordered style={{ marginTop: '8px' }}>
                  <Descriptions.Item label="Compagnie">{groupe.vol.compagnie}</Descriptions.Item>
                  <Descriptions.Item label="Vol">{groupe.vol.numero_vol}</Descriptions.Item>
                  <Descriptions.Item label="Départ">{dayjs(groupe.vol.date_depart).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                  <Descriptions.Item label="Trajet">{groupe.vol.aeroport_depart} ➔ {groupe.vol.aeroport_arrivee}</Descriptions.Item>
                </Descriptions>
              </div>
            )}

            {groupe.hotels && groupe.hotels.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <Title level={5} style={{ color: '#1a6b3a' }}>
                  <EnvironmentOutlined style={{ marginRight: '6px' }} /> Hôtels réservés
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                  {groupe.hotels.map((hotel: any) => (
                    <Card key={hotel.id} size="small" bodyStyle={{ padding: '8px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: '13px' }}>{hotel.nom}</Text>
                        <span style={{ color: '#fadb14', fontSize: '12px' }}>{'★'.repeat(hotel.etoiles)}</span>
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Ville : {hotel.ville}</Text>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </Col>

        {/* Right Column: Inscription Management */}
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: '10px' }}>
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: '1',
                  label: (
                    <span>
                      <UserOutlined /> Pèlerins assignés ({currentCount})
                    </span>
                  ),
                  children: (
                    <Table
                      columns={memberColumns}
                      dataSource={pelerins}
                      rowKey="id"
                      pagination={false}
                      size="middle"
                      locale={{ emptyText: 'Aucun pèlerin assigné à ce groupe pour le moment.' }}
                    />
                  ),
                },
                {
                  key: '2',
                  label: (
                    <span>
                      <UserAddOutlined /> Assigner des pèlerins ({unassignedPelerins.length})
                    </span>
                  ),
                  children: (
                    <div>
                      {placesLeft <= 0 ? (
                        <Alert
                          message="Groupe complet"
                          description="La capacité maximale de ce groupe a été atteinte. Vous ne pouvez plus lui affecter de nouveaux pèlerins."
                          type="warning"
                          showIcon
                          style={{ marginBottom: '16px' }}
                        />
                      ) : (
                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text>
                            Sélectionnez les pèlerins à ajouter (max. {placesLeft} places) :
                          </Text>
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddSelected}
                            disabled={selectedPelerinIds.length === 0}
                            style={{ backgroundColor: '#1a6b3a' }}
                          >
                            Ajouter la sélection ({selectedPelerinIds.length})
                          </Button>
                        </div>
                      )}

                      <Table
                        rowSelection={
                          placesLeft > 0
                            ? {
                                selectedRowKeys: selectedPelerinIds,
                                onChange: (keys) => setSelectedPelerinIds(keys),
                                getCheckboxProps: () => ({
                                  disabled: placesLeft === 0,
                                }),
                              }
                            : undefined
                        }
                        columns={unassignedColumns}
                        dataSource={unassignedPelerins}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        size="middle"
                        locale={{ emptyText: 'Tous les pèlerins inscrits ont déjà été affectés.' }}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AgentGroupeDetails;
