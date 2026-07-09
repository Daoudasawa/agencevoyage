import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, DatePicker, Row, Statistic, Typography, Spin, Table, Progress, Alert, Space, message } from 'antd';
import {
  UserOutlined,
  CreditCardOutlined,
  FileSearchOutlined,
  TeamOutlined,
  PieChartOutlined,
  BarChartOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../../services/api';

const { Title, Text } = Typography;

const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Colors for Pie Charts
const COLORS = ['#1a6b3a', '#c9a84c', '#1890ff', '#f5222d', '#fa8c16', '#722ed1'];

const AdminDashboard: React.FC = () => {
  const [paymentExportDates, setPaymentExportDates] = React.useState<[string, string] | null>(null);

  // Fetch stats from backend
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/statistiques');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Chargement du tableau de bord..." />
      </div>
    );
  }

  if (error || !stats) {
    return <Alert message="Erreur" description="Impossible de charger les statistiques de l'agence." type="error" showIcon />;
  }

  const { totaux, inscriptions_par_statut, inscriptions_par_forfait, paiements_par_mois, taux_remplissage_groupes } = stats;

  // Format charts data
  const statusChartData = inscriptions_par_statut?.map((item: any) => ({
    name: item.statut.toUpperCase(),
    value: parseInt(item.total),
  })) || [];

  const forfaitChartData = inscriptions_par_forfait?.map((item: any) => ({
    name: item.type === 'hajj' ? 'Hajj' : 'Omra',
    value: parseInt(item.total),
  })) || [];

  const monthlyPaymentsData = paiements_par_mois?.map((item: any) => ({
    name: item.mois,
    Montant: parseInt(item.total),
  })) || [];

  const handlePaymentExport = () => {
    const params = new URLSearchParams();
    if (paymentExportDates) {
      params.set('date_debut', paymentExportDates[0]);
      params.set('date_fin', paymentExportDates[1]);
    }

    api.get(`/admin/export/paiements?${params.toString()}`, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8;' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'paiements_export.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => message.error("Erreur lors de l'export des paiements."));
  };

  const groupColumns = [
    {
      title: 'Nom du Groupe',
      dataIndex: 'nom',
      key: 'nom',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Capacité',
      key: 'capacite',
      render: (_: any, record: any) => `${record.pelerins_count} / ${record.capacite_max}`,
    },
    {
      title: 'Taux de remplissage',
      key: 'taux',
      render: (_: any, record: any) => (
        <div style={{ width: 170 }}>
          <Progress percent={record.taux_remplissage} size="small" strokeColor="#1a6b3a" />
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ color: '#1a6b3a', margin: 0 }}>
          Tableau de Bord Direction
        </Title>
        <Text type="secondary">Indicateurs clés et statistiques d'activité</Text>
      </div>

      <Card style={{ marginBottom: '24px', borderRadius: '8px' }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Text strong>Export des paiements</Text>
            <div>
              <Text type="secondary">Filtrez par periode ou exportez tout l'historique.</Text>
            </div>
          </Col>
          <Col>
            <Space wrap>
              <DatePicker.RangePicker
                format="YYYY-MM-DD"
                onChange={(_, dateStrings) => {
                  setPaymentExportDates(dateStrings[0] && dateStrings[1] ? [dateStrings[0], dateStrings[1]] : null);
                }}
              />
              <Button icon={<ExportOutlined />} onClick={handlePaymentExport}>
                Exporter CSV
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Top statistics cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '8px' }}>
            <Statistic
              title="Pèlerins Inscrits"
              value={totaux.pelerins}
              valueStyle={{ color: '#1a6b3a' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '8px' }}>
            <Statistic
              title="Total Encaissé"
              value={formatFCFA(totaux.encaisse_fcfa)}
              valueStyle={{ color: '#389e0d', fontSize: '20px' }}
              prefix={<CreditCardOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '8px' }}>
            <Statistic
              title="Groupes de voyage"
              value={totaux.groupes}
              valueStyle={{ color: '#c9a84c' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '8px' }}>
            <Statistic
              title="Documents à vérifier"
              value={totaux.docs_en_attente}
              valueStyle={{ color: totaux.docs_en_attente > 0 ? '#fa8c16' : '#52c41a' }}
              prefix={<FileSearchOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Graphical reports section */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Monthly payments bar chart */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <span>
                <BarChartOutlined style={{ marginRight: '8px' }} /> Volume des Encaissements (12 derniers mois)
              </span>
            }
            style={{ borderRadius: '10px', height: '100%' }}
          >
            <div style={{ width: '100%', height: 300 }}>
              {monthlyPaymentsData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={monthlyPaymentsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => `${v / 1000000}M`} />
                    <Tooltip formatter={(value) => formatFCFA(value as number)} />
                    <Legend />
                    <Bar dataKey="Montant" fill="#1a6b3a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Text type="secondary">Aucun encaissement validé sur la période.</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Inscription Pie Chart */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <span>
                <PieChartOutlined style={{ marginRight: '8px' }} /> Répartition des Dossiers
              </span>
            }
            style={{ borderRadius: '10px', height: '100%' }}
          >
            <div style={{ width: '100%', height: 260, display: 'flex', flexDirection: 'column', justifyItems: 'center' }}>
              {statusChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {statusChartData.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                  <Text type="secondary">Aucun dossier enregistré.</Text>
                </div>
              )}
              {/* Legend checklist */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
                {statusChartData.map((item: any, index: number) => (
                  <Space key={item.name} size={4}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <Text style={{ fontSize: '11px' }}>{item.name} ({item.value})</Text>
                  </Space>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Fill rate of Groups */}
        <Col xs={24} md={12}>
          <Card title="Remplissage des Convois de voyage" style={{ borderRadius: '10px' }}>
            <Table
              columns={groupColumns}
              dataSource={taux_remplissage_groupes}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Hajj vs Omra ratio */}
        <Col xs={24} md={12}>
          <Card title="Répartition Hajj vs Omra" style={{ borderRadius: '10px' }}>
            <div style={{ width: '100%', height: 220, display: 'flex', flexDirection: 'column', justifyItems: 'center' }}>
              {forfaitChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={forfaitChartData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label>
                      {forfaitChartData.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 170 }}>
                  <Text type="secondary">Aucune inscription active.</Text>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '10px' }}>
                {forfaitChartData.map((item: any, index: number) => (
                  <Space key={item.name} size={4}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[(index + 1) % COLORS.length] }}></span>
                    <Text style={{ fontSize: '12px' }}>{item.name} : {item.value}</Text>
                  </Space>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
