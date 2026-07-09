import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Col, Row, Button, Tag, Typography, Spin, Modal, message, Descriptions, Space } from 'antd';
import { CompassOutlined, CheckCircleOutlined } from '@ant-design/icons';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

const PelerinForfaits: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch active dossier (to see if they are already inscribed)
  const { data: dossierData, isLoading: isDossierLoading } = useQuery({
    queryKey: ['mon-dossier'],
    queryFn: async () => {
      try {
        const response = await api.get('/inscriptions/mon-dossier');
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.status === 404) return null;
        throw error;
      }
    },
  });

  // Fetch all forfaits
  const { data: forfaits, isLoading: isForfaitsLoading } = useQuery({
    queryKey: ['forfaits-disponibles'],
    queryFn: async () => {
      const response = await api.get('/forfaits');
      return (response.data.data || response.data).filter((f: any) => f.actif);
    },
  });

  // Mutation for Inscription
  const inscriptionMutation = useMutation({
    mutationFn: async (forfaitId: number) => {
      const response = await api.post('/inscriptions', { forfait_id: forfaitId });
      return response.data;
    },
    onSuccess: () => {
      message.success('Inscription effectuée avec succès !');
      queryClient.invalidateQueries({ queryKey: ['mon-dossier'] });
      navigate('/pelerin/dashboard');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Erreur lors de l'inscription.";
      message.error(msg);
    },
  });

  if (isDossierLoading || isForfaitsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Chargement des forfaits..." />
      </div>
    );
  }

  const hasActiveInscription = !!dossierData;
  const currentForfaitId = dossierData?.inscription?.forfait_id;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ color: '#1a6b3a', margin: 0 }}>
          <CompassOutlined /> Nos Forfaits Hajj & Omra
        </Title>
        <Paragraph style={{ fontSize: '15px', color: '#666', marginTop: '8px' }}>
          Découvrez nos offres pour les pèlerinages aux lieux saints de l'Islam. Nos formules tout compris sont conçues pour vous offrir un pèlerinage serein et dans les meilleures conditions.
        </Paragraph>
      </div>

      {hasActiveInscription && (
        <Card
          style={{
            backgroundColor: '#e6f7ff',
            border: '1px solid #91d5ff',
            borderRadius: '8px',
            marginBottom: '24px',
          }}
          bodyStyle={{ padding: '16px' }}
        >
          <Text strong style={{ color: '#1890ff' }}>
            Information : Vous êtes actuellement inscrit au forfait "{dossierData.inscription.forfait.nom}". Vous ne pouvez pas souscrire à un autre forfait pour cette saison.
          </Text>
        </Card>
      )}

      <Row gutter={[24, 24]}>
        {forfaits?.map((forfait: any) => {
          const isCurrent = currentForfaitId === forfait.id;
          return (
            <Col xs={24} md={12} lg={8} key={forfait.id}>
              <Card
                title={
                  <span style={{ color: '#1a6b3a', fontWeight: 'bold' }}>
                    {forfait.nom} {isCurrent && <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: '6px' }} />}
                  </span>
                }
                extra={
                  <Space>
                    {isCurrent && <Tag color="success">Votre Forfait</Tag>}
                    <Tag color={forfait.type === 'hajj' ? 'gold' : 'blue'}>{forfait.type.toUpperCase()}</Tag>
                  </Space>
                }
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  borderRadius: '10px',
                  border: isCurrent ? '2px solid #52c41a' : '1px solid rgba(26,107,58,0.15)',
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
                  <Paragraph style={{ marginBottom: '16px', minHeight: '60px' }}>
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

                  {forfait.types_documents && forfait.types_documents.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <Text strong style={{ fontSize: '12px' }}>Documents requis :</Text>
                      <div style={{ marginTop: '4px' }}>
                        {forfait.types_documents.map((doc: any) => (
                          <Tag key={doc.id} style={{ marginBottom: '4px' }}>
                            {doc.nom} {doc.obligatoire && '*'}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!hasActiveInscription ? (
                  <Button
                    type="primary"
                    block
                    onClick={() => {
                      Modal.confirm({
                        title: 'Confirmer votre inscription',
                        content: `Voulez-vous valider votre inscription au forfait "${forfait.nom}" ?`,
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
                      marginTop: 'auto',
                    }}
                  >
                    Choisir ce forfait
                  </Button>
                ) : (
                  isCurrent && (
                    <Button
                      type="default"
                      block
                      disabled
                      style={{
                        color: '#52c41a',
                        borderColor: '#b7eb8f',
                        backgroundColor: '#f6ffed',
                        fontWeight: 'bold',
                        marginTop: 'auto',
                      }}
                    >
                      Inscrit
                    </Button>
                  )
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default PelerinForfaits;
