import React, { useState } from 'react';
import { 
  Tabs, Card, Form, Input, Button, Table, Space, 
  Modal, Select, InputNumber, Switch, message, 
  Upload, Popconfirm, Tag 
} from 'antd';
import { 
  EditOutlined, DeleteOutlined, PlusOutlined, 
  SaveOutlined, PictureOutlined, MessageOutlined,
  CompassOutlined, CalendarOutlined, QuestionCircleOutlined,
  InfoCircleOutlined, ContactsOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import type { 
  CmsSection, CmsService, CmsTestimonial, CmsGalleryItem, 
  CmsBlogPost, CmsFaq, CmsDeparture, CmsWhyChooseUs 
} from '../../types/homepage';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const CmsManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('hero');

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'service' | 'testimonial' | 'gallery' | 'blog' | 'faq' | 'departure' | 'whyChooseUs'>('service');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  // Queries
  const { data: sections = [], refetch: refetchSections } = useQuery<CmsSection[]>({
    queryKey: ['admin-sections'],
    queryFn: async () => {
      const res = await api.get('/admin/cms/sections');
      return res.data;
    }
  });

  const { data: services = [], refetch: refetchServices } = useQuery<CmsService[]>({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const res = await api.get('/admin/cms/services');
      return res.data;
    }
  });

  const { data: testimonials = [], refetch: refetchTestimonials } = useQuery<CmsTestimonial[]>({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const res = await api.get('/admin/cms/testimonials');
      return res.data;
    }
  });

  const { data: gallery = [], refetch: refetchGallery } = useQuery<CmsGalleryItem[]>({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const res = await api.get('/admin/cms/gallery');
      return res.data;
    }
  });

  const { data: blogPosts = [], refetch: refetchBlog } = useQuery<CmsBlogPost[]>({
    queryKey: ['admin-blog'],
    queryFn: async () => {
      const res = await api.get('/admin/cms/blog-posts');
      return res.data;
    }
  });

  const { data: faqs = [], refetch: refetchFaqs } = useQuery<CmsFaq[]>({
    queryKey: ['admin-faqs'],
    queryFn: async () => {
      const res = await api.get('/admin/cms/faqs');
      return res.data;
    }
  });

  const { data: departures = [], refetch: refetchDepartures } = useQuery<CmsDeparture[]>({
    queryKey: ['admin-departures'],
    queryFn: async () => {
      const res = await api.get('/admin/cms/departures');
      return res.data;
    }
  });

  const { data: whyChooseUs = [], refetch: refetchWhyChooseUs } = useQuery<CmsWhyChooseUs[]>({
    queryKey: ['admin-why-choose-us'],
    queryFn: async () => {
      const res = await api.get('/admin/cms/why-choose-us');
      return res.data;
    }
  });

  const { data: contactInfo = [], refetch: refetchContact } = useQuery<any[]>({
    queryKey: ['admin-contact'],
    queryFn: async () => {
      const res = await api.get('/admin/cms/contact');
      return res.data;
    }
  });

  // Forfaits list for departures dropdown
  const { data: forfaits = [] } = useQuery<any[]>({
    queryKey: ['forfaits-dropdown'],
    queryFn: async () => {
      const res = await api.get('/forfaits');
      return res.data;
    }
  });

  // Section Save Mutations
  const updateSectionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await api.put(`/admin/cms/sections/${id}`, data);
    },
    onSuccess: () => {
      message.success('Section mise à jour avec succès');
      refetchSections();
    }
  });

  // Generic Mutation helper for additions/deletions/updates
  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: number }) => {
      await api.delete(`/admin/cms/${type}/${id}`);
    },
    onSuccess: (_, variables) => {
      message.success('Élément supprimé avec succès');
      invalidateQueries(variables.type);
    }
  });

  const submitMutation = useMutation({
    mutationFn: async ({ type, id, values }: { type: string; id?: number; values: any }) => {
      if (id) {
        return await api.put(`/admin/cms/${type}/${id}`, values);
      } else {
        return await api.post(`/admin/cms/${type}`, values);
      }
    },
    onSuccess: (_, variables) => {
      message.success('Élément enregistré avec succès');
      setIsModalOpen(false);
      invalidateQueries(variables.type);
    }
  });

  const updateContactMutation = useMutation({
    mutationFn: async (values: any) => {
      await api.put('/admin/cms/contact-bulk', values);
    },
    onSuccess: () => {
      message.success('Coordonnées mises à jour');
      refetchContact();
    }
  });

  const invalidateQueries = (type: string) => {
    if (type === 'services') refetchServices();
    if (type === 'testimonials') refetchTestimonials();
    if (type === 'gallery') refetchGallery();
    if (type === 'blog-posts') refetchBlog();
    if (type === 'faqs') refetchFaqs();
    if (type === 'departures') refetchDepartures();
    if (type === 'why-choose-us') refetchWhyChooseUs();
  };

  const handleOpenModal = (type: typeof modalType, item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
    form.resetFields();
    if (item) {
      form.setFieldsValue(item);
    }
  };

  const handleModalSubmit = () => {
    form.validateFields().then(values => {
      let endpointType = '';
      if (modalType === 'service') endpointType = 'services';
      if (modalType === 'testimonial') endpointType = 'testimonials';
      if (modalType === 'gallery') endpointType = 'gallery';
      if (modalType === 'blog') endpointType = 'blog-posts';
      if (modalType === 'faq') endpointType = 'faqs';
      if (modalType === 'departure') endpointType = 'departures';
      if (modalType === 'whyChooseUs') endpointType = 'why-choose-us';

      submitMutation.mutate({
        type: endpointType,
        id: editingItem?.id,
        values
      });
    });
  };

  // Render components
  const renderHeroStats = () => {
    const hero = sections.find(s => s.key === 'hero');
    const stats = sections.find(s => s.key === 'stats');

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Hero Section (Bannière Principale)" extra={<PictureOutlined />}>
          {hero && (
            <Form
              layout="vertical"
              initialValues={{
                title: hero.title,
                subtitle: hero.subtitle,
                media_url: hero.media_url,
                btn1_text: hero.content?.btn1_text,
                btn1_link: hero.content?.btn1_link,
                btn2_text: hero.content?.btn2_text,
                btn2_link: hero.content?.btn2_link,
                is_active: hero.is_active,
              }}
              onFinish={(values) => {
                const { title, subtitle, media_url, is_active, ...content } = values;
                updateSectionMutation.mutate({
                  id: hero.id,
                  data: { title, subtitle, media_url, is_active, content }
                });
              }}
            >
              <Form.Item name="title" label="Titre Principal" rules={[{ required: true }]}>
                <Input placeholder="Accomplissez votre pèlerinage..." />
              </Form.Item>
              <Form.Item name="subtitle" label="Sous-titre / Description">
                <TextArea rows={3} placeholder="Une agence de confiance..." />
              </Form.Item>
              <Form.Item name="media_url" label="URL de l'image de fond">
                <Input placeholder="https://images.unsplash.com/..." />
              </Form.Item>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Form.Item name="btn1_text" label="Texte Bouton 1">
                  <Input placeholder="Découvrir les offres" />
                </Form.Item>
                <Form.Item name="btn1_link" label="Lien Bouton 1">
                  <Input placeholder="#offres" />
                </Form.Item>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Form.Item name="btn2_text" label="Texte Bouton 2">
                  <Input placeholder="Demander un devis" />
                </Form.Item>
                <Form.Item name="btn2_link" label="Lien Bouton 2">
                  <Input placeholder="#contact" />
                </Form.Item>
              </div>
              <Form.Item name="is_active" valuePropName="checked">
                <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Enregistrer Hero</Button>
            </Form>
          )}
        </Card>

        <Card title="Chiffres Clés & Statistiques" extra={<InfoCircleOutlined />}>
          {stats && (
            <Form
              layout="vertical"
              initialValues={{
                title: stats.title,
                subtitle: stats.subtitle,
                stat1_value: stats.content?.stat1_value,
                stat1_label: stats.content?.stat1_label,
                stat2_value: stats.content?.stat2_value,
                stat2_label: stats.content?.stat2_label,
                stat3_value: stats.content?.stat3_value,
                stat3_label: stats.content?.stat3_label,
                stat4_value: stats.content?.stat4_value,
                stat4_label: stats.content?.stat4_label,
              }}
              onFinish={(values) => {
                const { title, subtitle, ...content } = values;
                updateSectionMutation.mutate({
                  id: stats.id,
                  data: { title, subtitle, content, is_active: true }
                });
              }}
            >
              <Form.Item name="title" label="Titre de la Section" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="subtitle" label="Description">
                <Input />
              </Form.Item>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <Card size="small" title="Statistique 1">
                  <Form.Item name="stat1_value" label="Valeur">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="stat1_label" label="Libellé">
                    <Input />
                  </Form.Item>
                </Card>
                <Card size="small" title="Statistique 2">
                  <Form.Item name="stat2_value" label="Valeur">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="stat2_label" label="Libellé">
                    <Input />
                  </Form.Item>
                </Card>
                <Card size="small" title="Statistique 3">
                  <Form.Item name="stat3_value" label="Valeur">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="stat3_label" label="Libellé">
                    <Input />
                  </Form.Item>
                </Card>
                <Card size="small" title="Statistique 4">
                  <Form.Item name="stat4_value" label="Valeur">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="stat4_label" label="Libellé">
                    <Input />
                  </Form.Item>
                </Card>
              </div>

              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} style={{ marginTop: '24px' }}>
                Enregistrer Statistiques
              </Button>
            </Form>
          )}
        </Card>
      </Space>
    );
  };

  const renderServices = () => {
    const columns = [
      { title: 'Titre', dataIndex: 'title', key: 'title' },
      { title: 'Icône', dataIndex: 'icon', key: 'icon' },
      { title: 'Ordre', dataIndex: 'sort_order', key: 'sort_order' },
      { 
        title: 'Status', 
        dataIndex: 'is_active', 
        key: 'is_active',
        render: (active: boolean) => <Tag color={active ? 'green' : 'red'}>{active ? 'Actif' : 'Inactif'}</Tag>
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: CmsService) => (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenModal('service', record)}>Modifier</Button>
            <Popconfirm title="Supprimer cet élément ?" onConfirm={() => deleteMutation.mutate({ type: 'services', id: record.id })}>
              <Button size="small" danger icon={<DeleteOutlined />}>Supprimer</Button>
            </Popconfirm>
          </Space>
        )
      }
    ];

    return (
      <Card title="Gestion des Services Inclus" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal('service')}>Ajouter Service</Button>
      }>
        <Table dataSource={services} columns={columns} rowKey="id" />
      </Card>
    );
  };

  const renderTestimonials = () => {
    const columns = [
      { title: 'Nom', dataIndex: 'name', key: 'name' },
      { title: 'Pays', dataIndex: 'country', key: 'country' },
      { title: 'Note', dataIndex: 'rating', key: 'rating', render: (val: number) => `${val}/5` },
      { 
        title: 'Statut', 
        dataIndex: 'status', 
        key: 'status',
        render: (status: string) => (
          <Tag color={status === 'published' ? 'green' : status === 'pending' ? 'orange' : 'gray'}>
            {status.toUpperCase()}
          </Tag>
        )
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: CmsTestimonial) => (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenModal('testimonial', record)}>Éditer</Button>
            <Popconfirm title="Supprimer ce témoignage ?" onConfirm={() => deleteMutation.mutate({ type: 'testimonials', id: record.id })}>
              <Button size="small" danger icon={<DeleteOutlined />}>Supprimer</Button>
            </Popconfirm>
          </Space>
        )
      }
    ];

    return (
      <Card title="Modération des Témoignages" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal('testimonial')}>Ajouter Témoignage</Button>
      }>
        <Table dataSource={testimonials} columns={columns} rowKey="id" />
      </Card>
    );
  };

  const renderContact = () => {
    const initialValues: Record<string, string> = {};
    contactInfo.forEach(item => {
      initialValues[item.key] = item.value;
    });

    return (
      <Card title="Coordonnées de l'Agence" extra={<ContactsOutlined />}>
        <Form
          layout="vertical"
          initialValues={initialValues}
          onFinish={(values) => updateContactMutation.mutate(values)}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <Form.Item name="phone" label="Téléphone Principal">
              <Input />
            </Form.Item>
            <Form.Item name="whatsapp" label="Numéro WhatsApp (avec indicatif)">
              <Input />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <Form.Item name="email" label="Adresse E-mail">
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Adresse physique">
              <Input />
            </Form.Item>
          </div>

          <h4 style={{ margin: '16px 0 8px', fontWeight: 'bold' }}>Réseaux Sociaux</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <Form.Item name="facebook" label="Facebook URL">
              <Input />
            </Form.Item>
            <Form.Item name="twitter" label="Twitter/X URL">
              <Input />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} style={{ marginTop: '16px' }}>
            Sauvegarder Coordonnées
          </Button>
        </Form>
      </Card>
    );
  };

  const renderDepartures = () => {
    const columns = [
      { 
        title: 'Date', 
        dataIndex: 'date', 
        key: 'date',
        render: (val: string) => new Date(val).toLocaleDateString('fr-FR')
      },
      { 
        title: 'Type', 
        dataIndex: 'type', 
        key: 'type',
        render: (type: string) => <Tag color={type === 'hajj' ? 'amber' : 'emerald'}>{type.toUpperCase()}</Tag>
      },
      {
        title: 'Places',
        key: 'places',
        render: (_: any, record: CmsDeparture) => `${record.places_remaining}/${record.places_total}`
      },
      {
        title: 'Tarif (FCFA)',
        dataIndex: 'price',
        key: 'price',
        render: (val: number) => val.toLocaleString()
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: CmsDeparture) => (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenModal('departure', record)}>Modifier</Button>
            <Popconfirm title="Supprimer ce départ ?" onConfirm={() => deleteMutation.mutate({ type: 'departures', id: record.id })}>
              <Button size="small" danger icon={<DeleteOutlined />}>Supprimer</Button>
            </Popconfirm>
          </Space>
        )
      }
    ];

    return (
      <Card title="Calendrier des Départs Organisés" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal('departure')}>Créer Départ</Button>
      }>
        <Table dataSource={departures} columns={columns} rowKey="id" />
      </Card>
    );
  };

  return (
    <div>
      <h1 style={{ textAlign: 'left', margin: '0 0 24px', fontSize: '28px', fontWeight: 'bold' }}>
        CMS Page d'Accueil & Landing Page
      </h1>

      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane tab="Hero & Statistiques" key="hero">
          {renderHeroStats()}
        </TabPane>
        <TabPane tab="Services" key="services">
          {renderServices()}
        </TabPane>
        <TabPane tab="Témoignages" key="testimonials">
          {renderTestimonials()}
        </TabPane>
        <TabPane tab="Départs" key="departures">
          {renderDepartures()}
        </TabPane>
        <TabPane tab="Coordonnées" key="contact">
          {renderContact()}
        </TabPane>
      </Tabs>

      {/* Shared Edit Modal */}
      <Modal
        title={editingItem ? "Modifier l'élément" : "Créer un élément"}
        open={isModalOpen}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Enregistrer"
        cancelText="Annuler"
      >
        <Form form={form} layout="vertical">
          {modalType === 'service' && (
            <>
              <Form.Item name="title" label="Titre du Service" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <TextArea rows={2} />
              </Form.Item>
              <Form.Item name="icon" label="Identifiant d'Icône" rules={[{ required: true }]}>
                <Select placeholder="Choisir une icône">
                  <Option value="visa">Passport / Visa</Option>
                  <Option value="flight">Avion / Vol</Option>
                  <Option value="hotel">Hôtel / Logement</Option>
                  <Option value="transport">Bus / Transport local</Option>
                  <Option value="guide">Guide religieux</Option>
                  <Option value="assistance">Assistance 24/7</Option>
                  <Option value="insurance">Assurance Médicale</Option>
                </Select>
              </Form.Item>
              <Form.Item name="sort_order" label="Ordre de tri">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="is_active" valuePropName="checked" initialValue={true}>
                <Switch checkedChildren="Actif" unCheckedChildren="Inactif" />
              </Form.Item>
            </>
          )}

          {modalType === 'testimonial' && (
            <>
              <Form.Item name="name" label="Nom Complet du Pèlerin" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="country" label="Pays" rules={[{ required: true }]} initialValue="Burkina Faso">
                <Input />
              </Form.Item>
              <Form.Item name="review" label="Témoignage / Avis" rules={[{ required: true }]}>
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item name="rating" label="Note (Étoiles)" rules={[{ required: true }]} initialValue={5}>
                <InputNumber min={1} max={5} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="status" label="Statut de Publication" rules={[{ required: true }]} initialValue="published">
                <Select>
                  <Option value="pending">En attente</Option>
                  <Option value="published">Publié</Option>
                  <Option value="archived">Archivé</Option>
                </Select>
              </Form.Item>
            </>
          )}

          {modalType === 'departure' && (
            <>
              <Form.Item name="date" label="Date de Départ" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
              <Form.Item name="type" label="Type de Pèlerinage" rules={[{ required: true }]} initialValue="hajj">
                <Select>
                  <Option value="hajj">Hajj</Option>
                  <Option value="omra">Omra</Option>
                </Select>
              </Form.Item>
              <Form.Item name="forfait_id" label="Forfait Associé">
                <Select placeholder="Sélectionner le forfait (facultatif)">
                  <Option value={null}>Aucun</Option>
                  {forfaits.map((f: any) => (
                    <Option key={f.id} value={f.id}>{f.nom} ({f.prix.toLocaleString()} F)</Option>
                  ))}
                </Select>
              </Form.Item>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Form.Item name="places_total" label="Places Totales" rules={[{ required: true }]} initialValue={50}>
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="places_remaining" label="Places Restantes" rules={[{ required: true }]} initialValue={50}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </div>
              <Form.Item name="price" label="Tarif Convoi (FCFA)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="is_active" valuePropName="checked" initialValue={true}>
                <Switch checkedChildren="Actif" unCheckedChildren="Inactif" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default CmsManager;
