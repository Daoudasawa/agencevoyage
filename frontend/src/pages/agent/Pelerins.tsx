import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Card, Input, Button, Tag, Space, Typography, Spin, Row, Col, Select, message } from 'antd';
import { SearchOutlined, EyeOutlined, ExportOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;

const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

const AgentPelerins: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [forfaitTypeFilter, setForfaitTypeFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (statusFilter !== 'all') params.set('statut', statusFilter);
    if (forfaitTypeFilter !== 'all') params.set('forfait_type', forfaitTypeFilter);
    if (groupFilter !== 'all') params.set('groupe_id', groupFilter);
    return params;
  }, [debouncedSearch, statusFilter, forfaitTypeFilter, groupFilter]);

  const { data: groupes } = useQuery({
    queryKey: ['groupes-list'],
    queryFn: async () => {
      const response = await api.get('/admin/groupes');
      return response.data.data || response.data;
    },
  });

  const { data: pelerinsData, isLoading } = useQuery({
    queryKey: ['admin-pelerins', queryParams.toString(), currentPage],
    queryFn: async () => {
      const params = new URLSearchParams(queryParams);
      params.set('page', String(currentPage));
      const response = await api.get(`/admin/pelerins?${params.toString()}`);
      return response.data;
    },
  });

  const pelerins = pelerinsData?.data || pelerinsData || [];

  const resetPageFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleExport = () => {
    api.get(`/admin/export/pelerins?${queryParams.toString()}`, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8;' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'pelerins_export.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => message.error("Erreur lors de l'export CSV."));
  };

  const getStatusTag = (statut: string) => {
    switch (statut) {
      case 'incomplet':
        return <Tag color="warning">Incomplet</Tag>;
      case 'en_verification':
        return <Tag color="processing">En verification</Tag>;
      case 'valide':
        return <Tag color="success">Valide</Tag>;
      case 'desiste':
        return <Tag color="error">Desiste</Tag>;
      default:
        return <Tag color="default">Aucun</Tag>;
    }
  };

  const columns = [
    {
      title: 'Pelerin',
      key: 'nom',
      render: (_: any, record: any) => (
        <div>
          <Text strong style={{ fontSize: '14px' }}>
            {record.user?.prenom} {record.user?.nom}
          </Text>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.user?.email}</div>
        </div>
      ),
    },
    {
      title: 'Telephone',
      dataIndex: 'telephone',
      key: 'telephone',
      render: (telephone: string) => telephone || '-',
    },
    {
      title: 'Forfait actif',
      key: 'forfait',
      render: (_: any, record: any) => {
        const forfait = record.inscription_active?.forfait;
        if (!forfait) return <Text type="secondary">Aucun</Text>;
        return (
          <Space direction="vertical" size={0}>
            <Text>{forfait.nom}</Text>
            <Tag color={forfait.type === 'hajj' ? 'gold' : 'blue'}>{forfait.type.toUpperCase()}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Statut dossier',
      key: 'statut',
      render: (_: any, record: any) => getStatusTag(record.inscription_active?.statut || 'non_inscrit'),
    },
    {
      title: 'Groupe',
      key: 'groupe',
      render: (_: any, record: any) => (
        record.groupe ? (
          <Link to={`/agent/groupes/${record.groupe.id}`} style={{ fontWeight: 'bold', color: '#1a6b3a' }}>
            {record.groupe.nom}
          </Link>
        ) : (
          <Text type="secondary">Non affecte</Text>
        )
      ),
    },
    {
      title: 'Total paye',
      key: 'paid',
      render: (_: any, record: any) => {
        const total = (record.paiements || [])
          .filter((paiement: any) => paiement.statut === 'valide')
          .reduce((sum: number, paiement: any) => sum + parseInt(paiement.montant), 0);
        return formatFCFA(total);
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => navigate(`/agent/pelerins/${record.id}`)}
          style={{ backgroundColor: '#1a6b3a', borderColor: '#13522b' }}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }} gutter={[16, 16]}>
        <Col>
          <Title level={2} style={{ color: '#1a6b3a', margin: 0 }}>
            Liste des Pelerins
          </Title>
          <Text type="secondary">Rechercher et filtrer les dossiers des pelerins de l'agence</Text>
        </Col>
        <Col>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            Exporter CSV
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: '24px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Rechercher par nom, prenom ou email..."
              prefix={<SearchOutlined style={{ color: '#1a6b3a' }} />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              size="large"
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} md={5}>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={resetPageFilter(setStatusFilter)}
              size="large"
            >
              <Select.Option value="all">Tous les statuts</Select.Option>
              <Select.Option value="incomplet">Incomplet</Select.Option>
              <Select.Option value="en_verification">En verification</Select.Option>
              <Select.Option value="valide">Valide</Select.Option>
              <Select.Option value="desiste">Desiste</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={5}>
            <Select
              style={{ width: '100%' }}
              value={forfaitTypeFilter}
              onChange={resetPageFilter(setForfaitTypeFilter)}
              size="large"
            >
              <Select.Option value="all">Tous types</Select.Option>
              <Select.Option value="hajj">Hajj</Select.Option>
              <Select.Option value="omra">Omra</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Select
              style={{ width: '100%' }}
              value={groupFilter}
              onChange={resetPageFilter(setGroupFilter)}
              size="large"
            >
              <Select.Option value="all">Tous groupes</Select.Option>
              {groupes?.map((groupe: any) => (
                <Select.Option key={groupe.id} value={String(groupe.id)}>
                  {groupe.nom}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" tip="Chargement des pelerins..." />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={pelerins}
            rowKey="id"
            pagination={{
              current: currentPage,
              total: pelerinsData?.total || pelerins.length,
              pageSize: pelerinsData?.per_page || 20,
              onChange: (page) => setCurrentPage(page),
            }}
            size="middle"
          />
        )}
      </Card>
    </div>
  );
};

export default AgentPelerins;
