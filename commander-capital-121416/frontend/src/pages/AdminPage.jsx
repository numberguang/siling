import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes, faUpload, faSignOutAlt, faTachometerAlt, faFileAlt, faHandshake, faBriefcase, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { LanguageContext } from '../contexts/LanguageContext';

// 管理页面通用布局组件
const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 检查用户登录状态
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // 验证令牌是否有效
    const checkAuthStatus = async () => {
      try {
        // 这里可以实现一个API调用来验证令牌
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.role === 'admin') {
          setUser(userData);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* 侧边导航栏 */}
        <div className="col-md-2 bg-dark text-white min-vh-100 p-3">
          <h3 className="mb-4">管理控制台</h3>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/admin" className="nav-link text-white">
                <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
                控制面板
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/contents" className="nav-link text-white">
                <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                内容管理
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/business" className="nav-link text-white">
                <FontAwesomeIcon icon={faBriefcase} className="me-2" />
                业务类型
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/partners" className="nav-link text-white">
                <FontAwesomeIcon icon={faHandshake} className="me-2" />
                合作伙伴
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/legal" className="nav-link text-white">
                <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                法律文档
              </Link>
            </li>
          </ul>
          <div className="mt-5">
            <button 
              className="btn btn-outline-light" 
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
              退出登录
            </button>
          </div>
        </div>
        
        {/* 主内容区域 */}
        <div className="col-md-10 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// 控制面板
const Dashboard = () => {
  const [stats, setStats] = useState({
    contents: 0,
    partners: 0,
    businessTypes: 0,
    legalDocs: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // 获取各类型数据的统计信息
        const [contents, partners, businessTypes, legalDocs] = await Promise.all([
          axios.get('/api/admin/contents', { headers }),
          axios.get('/api/admin/partners', { headers }),
          axios.get('/api/admin/business-types', { headers }),
          axios.get('/api/admin/legal-docs', { headers })
        ]);

        setStats({
          contents: contents.data.length,
          partners: partners.data.length,
          businessTypes: businessTypes.data.length,
          legalDocs: legalDocs.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="mb-4">控制面板</h2>
      
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">内容数量</h5>
              <h3 className="card-text">{stats.contents}</h3>
              <Link to="/admin/contents" className="text-white">查看详情 &raquo;</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">业务类型</h5>
              <h3 className="card-text">{stats.businessTypes}</h3>
              <Link to="/admin/business" className="text-white">查看详情 &raquo;</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">合作伙伴</h5>
              <h3 className="card-text">{stats.partners}</h3>
              <Link to="/admin/partners" className="text-white">查看详情 &raquo;</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">法律文档</h5>
              <h3 className="card-text">{stats.legalDocs}</h3>
              <Link to="/admin/legal" className="text-white">查看详情 &raquo;</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 内容管理组件
const ContentManager = () => {
  const [contents, setContents] = useState([]);
  const [editingContent, setEditingContent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState({
    section: '',
    key: '',
    zh_content: '',
    en_content: ''
  });
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/contents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContents(response.data);
    } catch (error) {
      console.error('Error fetching contents:', error);
    }
  };

  const handleEditContent = (content) => {
    setEditingContent({ ...content });
  };

  const handleUpdateContent = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/update', {
        id: editingContent.id,
        type: 'content',
        content: {
          zh_content: editingContent.zh_content,
          en_content: editingContent.en_content
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditingContent(null);
      fetchContents();
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleDeleteContent = async (id) => {
    if (!window.confirm('确定要删除这条内容吗？')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/content/${id}?type=content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContents();
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/content', newContent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddForm(false);
      setNewContent({
        section: '',
        key: '',
        zh_content: '',
        en_content: ''
      });
      fetchContents();
    } catch (error) {
      console.error('Error adding content:', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>内容管理</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FontAwesomeIcon icon={showAddForm ? faTimes : faPlus} className="me-2" />
          {showAddForm ? '取消' : '添加内容'}
        </button>
      </div>
      
      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">添加新内容</h5>
            <form onSubmit={handleAddContent}>
              <div className="mb-3">
                <label className="form-label">区域 (section)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newContent.section} 
                  onChange={(e) => setNewContent({...newContent, section: e.target.value})} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">键名 (key)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newContent.key} 
                  onChange={(e) => setNewContent({...newContent, key: e.target.value})} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">中文内容</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  value={newContent.zh_content} 
                  onChange={(e) => setNewContent({...newContent, zh_content: e.target.value})} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">英文内容</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  value={newContent.en_content} 
                  onChange={(e) => setNewContent({...newContent, en_content: e.target.value})} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-success">
                <FontAwesomeIcon icon={faSave} className="me-2" />
                保存
              </button>
            </form>
          </div>
        </div>
      )}
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>区域</th>
              <th>键名</th>
              <th>内容</th>
              <th>最后更新</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {contents.map(content => (
              <tr key={content.id}>
                <td>{content.id}</td>
                <td>{content.section}</td>
                <td>{content.key}</td>
                <td>
                  {editingContent && editingContent.id === content.id ? (
                    <div>
                      <div className="mb-2">
                        <label className="form-label">中文内容</label>
                        <textarea 
                          className="form-control" 
                          value={editingContent.zh_content} 
                          onChange={(e) => setEditingContent({...editingContent, zh_content: e.target.value})} 
                        />
                      </div>
                      <div>
                        <label className="form-label">英文内容</label>
                        <textarea 
                          className="form-control" 
                          value={editingContent.en_content} 
                          onChange={(e) => setEditingContent({...editingContent, en_content: e.target.value})} 
                        />
                      </div>
                      <div className="mt-2">
                        <button className="btn btn-sm btn-success me-2" onClick={handleUpdateContent}>
                          <FontAwesomeIcon icon={faSave} className="me-1" />保存
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditingContent(null)}>
                          <FontAwesomeIcon icon={faTimes} className="me-1" />取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {language === 'zh' ? content.zh_content : content.en_content}
                    </div>
                  )}
                </td>
                <td>{new Date(content.updated_at).toLocaleString()}</td>
                <td>
                  {!editingContent && (
                    <div>
                      <button 
                        className="btn btn-sm btn-primary me-2" 
                        onClick={() => handleEditContent(content)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDeleteContent(content.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 业务类型管理组件
const BusinessManager = () => {
  const [businessTypes, setBusinessTypes] = useState([]);
  const [editingBusiness, setEditingBusiness] = useState(null);
  
  useEffect(() => {
    fetchBusinessTypes();
  }, []);

  const fetchBusinessTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/business-types', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBusinessTypes(response.data);
    } catch (error) {
      console.error('Error fetching business types:', error);
    }
  };

  const handleEditBusiness = (business) => {
    setEditingBusiness({ ...business });
  };

  const handleUpdateBusiness = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/update', {
        id: editingBusiness.id,
        type: 'business',
        content: editingBusiness
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditingBusiness(null);
      fetchBusinessTypes();
    } catch (error) {
      console.error('Error updating business type:', error);
    }
  };

  return (
    <div>
      <h2 className="mb-4">业务类型管理</h2>
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>键名</th>
              <th>中文名称</th>
              <th>英文名称</th>
              <th>显示顺序</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {businessTypes.map(business => (
              <tr key={business.id}>
                <td>{business.id}</td>
                <td>{business.type_key}</td>
                <td>
                  {editingBusiness && editingBusiness.id === business.id ? (
                    <input 
                      type="text" 
                      className="form-control" 
                      value={editingBusiness.zh_name} 
                      onChange={(e) => setEditingBusiness({...editingBusiness, zh_name: e.target.value})} 
                    />
                  ) : (
                    business.zh_name
                  )}
                </td>
                <td>
                  {editingBusiness && editingBusiness.id === business.id ? (
                    <input 
                      type="text" 
                      className="form-control" 
                      value={editingBusiness.en_name} 
                      onChange={(e) => setEditingBusiness({...editingBusiness, en_name: e.target.value})} 
                    />
                  ) : (
                    business.en_name
                  )}
                </td>
                <td>
                  {editingBusiness && editingBusiness.id === business.id ? (
                    <input 
                      type="number" 
                      className="form-control" 
                      value={editingBusiness.display_order} 
                      onChange={(e) => setEditingBusiness({...editingBusiness, display_order: parseInt(e.target.value)})} 
                    />
                  ) : (
                    business.display_order
                  )}
                </td>
                <td>
                  {editingBusiness && editingBusiness.id === business.id ? (
                    <div>
                      <button className="btn btn-sm btn-success me-2" onClick={handleUpdateBusiness}>
                        <FontAwesomeIcon icon={faSave} className="me-1" />保存
                      </button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditingBusiness(null)}>
                        <FontAwesomeIcon icon={faTimes} className="me-1" />取消
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn btn-sm btn-primary" 
                      onClick={() => handleEditBusiness(business)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {editingBusiness && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">编辑业务类型描述</h5>
            <div className="mb-3">
              <label className="form-label">中文描述</label>
              <textarea 
                className="form-control" 
                rows="3" 
                value={editingBusiness.zh_description || ''} 
                onChange={(e) => setEditingBusiness({...editingBusiness, zh_description: e.target.value})} 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">英文描述</label>
              <textarea 
                className="form-control" 
                rows="3" 
                value={editingBusiness.en_description || ''} 
                onChange={(e) => setEditingBusiness({...editingBusiness, en_description: e.target.value})} 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">图标URL</label>
              <input 
                type="text" 
                className="form-control" 
                value={editingBusiness.icon_url || ''} 
                onChange={(e) => setEditingBusiness({...editingBusiness, icon_url: e.target.value})} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 合作伙伴管理组件
const PartnersManager = () => {
  const [partners, setPartners] = useState([]);
  const [editingPartner, setEditingPartner] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    website_url: '',
    display_order: 0,
    logo: null
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/partners', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPartners(response.data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const handleEditPartner = (partner) => {
    setEditingPartner({ ...partner });
  };

  const handleUpdatePartner = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/update', {
        id: editingPartner.id,
        type: 'partner',
        content: {
          name: editingPartner.name,
          logo_url: editingPartner.logo_url,
          website_url: editingPartner.website_url,
          display_order: editingPartner.display_order
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditingPartner(null);
      fetchPartners();
    } catch (error) {
      console.error('Error updating partner:', error);
    }
  };

  const handleDeletePartner = async (id) => {
    if (!window.confirm('确定要删除这个合作伙伴吗？')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/content/${id}?type=partner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  const handleFileChange = (e) => {
    setNewPartner({ ...newPartner, logo: e.target.files[0] });
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', newPartner.name);
    formData.append('website_url', newPartner.website_url);
    formData.append('display_order', newPartner.display_order);
    formData.append('logo', newPartner.logo);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/partners', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setShowAddForm(false);
      setNewPartner({
        name: '',
        website_url: '',
        display_order: 0,
        logo: null
      });
      fetchPartners();
    } catch (error) {
      console.error('Error adding partner:', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>合作伙伴管理</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FontAwesomeIcon icon={showAddForm ? faTimes : faPlus} className="me-2" />
          {showAddForm ? '取消' : '添加合作伙伴'}
        </button>
      </div>
      
      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">添加新合作伙伴</h5>
            <form onSubmit={handleAddPartner}>
              <div className="mb-3">
                <label className="form-label">名称</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newPartner.name} 
                  onChange={(e) => setNewPartner({...newPartner, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">网站URL</label>
                <input 
                  type="url" 
                  className="form-control" 
                  value={newPartner.website_url} 
                  onChange={(e) => setNewPartner({...newPartner, website_url: e.target.value})} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">显示顺序</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={newPartner.display_order} 
                  onChange={(e) => setNewPartner({...newPartner, display_order: parseInt(e.target.value)})} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Logo</label>
                <input 
                  type="file" 
                  className="form-control" 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-success">
                <FontAwesomeIcon icon={faSave} className="me-2" />
                保存
              </button>
            </form>
          </div>
        </div>
      )}
      
      <div className="row">
        {partners.map(partner => (
          <div key={partner.id} className="col-md-4 mb-4">
            <div className="card">
              <img 
                src={partner.logo_url} 
                className="card-img-top p-3" 
                alt={partner.name} 
                style={{ maxHeight: '150px', objectFit: 'contain' }} 
              />
              <div className="card-body">
                <h5 className="card-title">{partner.name}</h5>
                {editingPartner && editingPartner.id === partner.id ? (
                  <div>
                    <div className="mb-3">
                      <label className="form-label">名称</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editingPartner.name} 
                        onChange={(e) => setEditingPartner({...editingPartner, name: e.target.value})} 
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">网站URL</label>
                      <input 
                        type="url" 
                        className="form-control" 
                        value={editingPartner.website_url || ''} 
                        onChange={(e) => setEditingPartner({...editingPartner, website_url: e.target.value})} 
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">显示顺序</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={editingPartner.display_order} 
                        onChange={(e) => setEditingPartner({...editingPartner, display_order: parseInt(e.target.value)})} 
                      />
                    </div>
                    <button className="btn btn-sm btn-success me-2" onClick={handleUpdatePartner}>
                      <FontAwesomeIcon icon={faSave} className="me-1" />保存
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setEditingPartner(null)}>
                      <FontAwesomeIcon icon={faTimes} className="me-1" />取消
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="card-text">
                      <small className="text-muted">
                        {partner.website_url && (
                          <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
                            访问网站
                          </a>
                        )}
                        {!partner.website_url && '无网站链接'}
                      </small>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">显示顺序: {partner.display_order}</small>
                    </p>
                    <div className="d-flex">
                      <button 
                        className="btn btn-sm btn-primary me-2" 
                        onClick={() => handleEditPartner(partner)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDeletePartner(partner.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 法律文档管理组件
const LegalDocsManager = () => {
  const [legalDocs, setLegalDocs] = useState([]);
  const [editingDoc, setEditingDoc] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    zh_content: '',
    en_content: '',
    doc_type: 'terms',
    is_visible: true
  });

  useEffect(() => {
    fetchLegalDocs();
  }, []);

  const fetchLegalDocs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/legal-docs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLegalDocs(response.data);
    } catch (error) {
      console.error('Error fetching legal docs:', error);
    }
  };

  const handleEditDoc = (doc) => {
    setEditingDoc({ ...doc });
  };

  const handleUpdateDoc = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/update', {
        id: editingDoc.id,
        type: 'legal',
        content: {
          title: editingDoc.title,
          zh_content: editingDoc.zh_content,
          en_content: editingDoc.en_content,
          doc_type: editingDoc.doc_type,
          is_visible: editingDoc.is_visible
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditingDoc(null);
      fetchLegalDocs();
    } catch (error) {
      console.error('Error updating legal doc:', error);
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('确定要删除这个文档吗？')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/content/${id}?type=legal`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLegalDocs();
    } catch (error) {
      console.error('Error deleting legal doc:', error);
    }
  };

  const handleAddDoc = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/legal-docs', newDoc, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddForm(false);
      setNewDoc({
        title: '',
        zh_content: '',
        en_content: '',
        doc_type: 'terms',
        is_visible: true
      });
      fetchLegalDocs();
    } catch (error) {
      console.error('Error adding legal doc:', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>法律文档管理</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FontAwesomeIcon icon={showAddForm ? faTimes : faPlus} className="me-2" />
          {showAddForm ? '取消' : '添加文档'}
        </button>
      </div>
      
      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">添加新法律文档</h5>
            <form onSubmit={handleAddDoc}>
              <div className="mb-3">
                <label className="form-label">文档标题</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newDoc.title} 
                  onChange={(e) => setNewDoc({...newDoc, title: e.target.value})} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">文档类型</label>
                <select 
                  className="form-select" 
                  value={newDoc.doc_type} 
                  onChange={(e) => setNewDoc({...newDoc, doc_type: e.target.value})}
                >
                  <option value="terms">服务条款</option>
                  <option value="privacy">隐私政策</option>
                  <option value="disclaimer">免责声明</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">中文内容</label>
                <textarea 
                  className="form-control" 
                  rows="5" 
                  value={newDoc.zh_content} 
                  onChange={(e) => setNewDoc({...newDoc, zh_content: e.target.value})} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">英文内容</label>
                <textarea 
                  className="form-control" 
                  rows="5" 
                  value={newDoc.en_content} 
                  onChange={(e) => setNewDoc({...newDoc, en_content: e.target.value})} 
                  required 
                />
              </div>
              <div className="mb-3 form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="is_visible" 
                  checked={newDoc.is_visible} 
                  onChange={(e) => setNewDoc({...newDoc, is_visible: e.target.checked})} 
                />
                <label className="form-check-label" htmlFor="is_visible">显示文档</label>
              </div>
              <button type="submit" className="btn btn-success">
                <FontAwesomeIcon icon={faSave} className="me-2" />
                保存
              </button>
            </form>
          </div>
        </div>
      )}
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>标题</th>
              <th>类型</th>
              <th>状态</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {legalDocs.map(doc => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.title}</td>
                <td>
                  {(() => {
                    switch(doc.doc_type) {
                      case 'terms': return '服务条款';
                      case 'privacy': return '隐私政策';
                      case 'disclaimer': return '免责声明';
                      default: return '其他';
                    }
                  })()}
                </td>
                <td>
                  {doc.is_visible ? 
                    <span className="text-success"><FontAwesomeIcon icon={faEye} /> 可见</span> : 
                    <span className="text-secondary"><FontAwesomeIcon icon={faEyeSlash} /> 隐藏</span>
                  }
                </td>
                <td>{new Date(doc.updated_at).toLocaleString()}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary me-2" 
                    onClick={() => handleEditDoc(doc)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDeleteDoc(doc.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {editingDoc && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">编辑文档: {editingDoc.title}</h5>
            <div className="mb-3">
              <label className="form-label">文档标题</label>
              <input 
                type="text" 
                className="form-control" 
                value={editingDoc.title} 
                onChange={(e) => setEditingDoc({...editingDoc, title: e.target.value})} 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">文档类型</label>
              <select 
                className="form-select" 
                value={editingDoc.doc_type} 
                onChange={(e) => setEditingDoc({...editingDoc, doc_type: e.target.value})}
              >
                <option value="terms">服务条款</option>
                <option value="privacy">隐私政策</option>
                <option value="disclaimer">免责声明</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">中文内容</label>
              <textarea 
                className="form-control" 
                rows="5" 
                value={editingDoc.zh_content} 
                onChange={(e) => setEditingDoc({...editingDoc, zh_content: e.target.value})} 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">英文内容</label>
              <textarea 
                className="form-control" 
                rows="5" 
                value={editingDoc.en_content} 
                onChange={(e) => setEditingDoc({...editingDoc, en_content: e.target.value})} 
              />
            </div>
            <div className="mb-3 form-check">
              <input 
                type="checkbox" 
                className="form-check-input" 
                id="edit_is_visible" 
                checked={editingDoc.is_visible} 
                onChange={(e) => setEditingDoc({...editingDoc, is_visible: e.target.checked})} 
              />
              <label className="form-check-label" htmlFor="edit_is_visible">显示文档</label>
            </div>
            <div>
              <button className="btn btn-success me-2" onClick={handleUpdateDoc}>
                <FontAwesomeIcon icon={faSave} className="me-1" />保存
              </button>
              <button className="btn btn-secondary" onClick={() => setEditingDoc(null)}>
                <FontAwesomeIcon icon={faTimes} className="me-1" />取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 主管理页面组件
const AdminPage = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/contents" element={<ContentManager />} />
        <Route path="/business" element={<BusinessManager />} />
        <Route path="/partners" element={<PartnersManager />} />
        <Route path="/legal" element={<LegalDocsManager />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPage;