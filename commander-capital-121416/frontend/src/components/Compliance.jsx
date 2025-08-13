import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faShieldAlt, faBalanceScale, faFileContract, faGavel } from '@fortawesome/free-solid-svg-icons';
import { LanguageContext } from '../contexts/LanguageContext';
import axios from 'axios';

const Compliance = () => {
  const { language } = useContext(LanguageContext);
  const [contents, setContents] = useState({});
  const [legalDocs, setLegalDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDoc, setOpenDoc] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/content?lang=${language}`);
        
        // Extract compliance section content
        if (response.data.contents && response.data.contents.compliance) {
          setContents(response.data.contents.compliance);
        }
        
        // Extract legal documents
        if (response.data.legalDocs) {
          setLegalDocs(response.data.legalDocs);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch compliance data:", err);
        setError(language === 'en' 
          ? "Failed to load compliance information. Please try again later." 
          : "加载合规信息失败，请稍后再试。");
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  const toggleDoc = (id) => {
    setOpenDoc(openDoc === id ? null : id);
  };

  if (loading) {
    return (
      <section id="compliance" className="compliance">
        <div className="container">
          <div className="section-title">
            <h2>{language === 'en' ? 'Loading...' : '加载中...'}</h2>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="compliance" className="compliance">
        <div className="container">
          <div className="section-title">
            <h2>{language === 'en' ? 'Compliance' : '合规声明'}</h2>
          </div>
          <div className="legal-box">
            <p className="text-danger">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="compliance" className="compliance">
      <div className="container">
        <div className="section-title">
          <h2>{language === 'en' ? 'Compliance Statement' : '合规声明'}</h2>
        </div>
        
        {/* Legal Notice Box */}
        <div className="legal-box">
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-3">
                <div className="compliance-icon me-3">
                  <FontAwesomeIcon icon={faShieldAlt} size="2x" className="text-primary" />
                </div>
                <h3 className="legal-title">
                  {language === 'en' ? 'Legal Notice' : '法律声明'}
                </h3>
              </div>
              
              <div className="legal-notice">
                {contents.legal_notice || 
                  (language === 'en' 
                    ? 'This platform only serves non-resident qualified investors. Residents of Samoa are prohibited from participating. NTF does not represent equity and does not promise investment returns. Users must bear risks themselves.'
                    : '本平台仅服务非居民合格投资者，禁止萨摩亚境内居民参与。NTF不代表股权，不承诺投资收益，用户需自担风险。'
                  )
                }
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-3">
                <div className="compliance-icon me-3">
                  <FontAwesomeIcon icon={faBalanceScale} size="2x" className="text-primary" />
                </div>
                <h3 className="legal-title">
                  {language === 'en' ? 'Regulatory Compliance' : '监管合规'}
                </h3>
              </div>
              
              <div className="compliance-structure">
                <p className="mb-3">
                  {language === 'en' 
                    ? 'Commander Capital operates under the laws and regulations of Samoa, maintaining rigorous compliance standards in all operations.'
                    : '司令（Siling）严格遵循萨摩亚法律法规，在所有业务中保持严格的合规标准。'
                  }
                </p>
                <div className="registration-info mb-3 p-3 bg-light rounded">
                  <small className="d-block mb-1 text-muted">
                    {language === 'en' ? 'Registration Number' : '注册编号'}:
                  </small>
                  <strong>SA12345678</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* White Paper Section */}
        <div className="legal-box">
          <div className="d-flex align-items-center mb-3">
            <div className="compliance-icon me-3">
              <FontAwesomeIcon icon={faFileContract} size="2x" className="text-primary" />
            </div>
            <h3 className="legal-title">
              {language === 'en' ? 'Regulatory White Paper' : '监管白皮书'}
            </h3>
          </div>
          
          <p className="mb-4">
            {language === 'en' 
              ? 'Key sections of the white paper submitted to the Samoa Financial Management Authority.'
              : '向萨摩亚金融管理局提交的白皮书核心章节。'
            }
          </p>
          
          <div className="legal-docs">
            {legalDocs.length > 0 ? (
              legalDocs.map((doc) => (
                <div key={doc.id} className="doc-accordion">
                  <div 
                    className="doc-header" 
                    onClick={() => toggleDoc(doc.id)}
                  >
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faGavel} className="me-2 text-primary" />
                      <span>{doc.title}</span>
                    </div>
                    <FontAwesomeIcon 
                      icon={openDoc === doc.id ? faChevronUp : faChevronDown} 
                    />
                  </div>
                  <div className={`doc-content ${openDoc === doc.id ? 'open' : ''}`}>
                    <div dangerouslySetInnerHTML={{ __html: doc.content }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4">
                <p>
                  {language === 'en' 
                    ? 'White paper documents are being prepared and will be available soon.'
                    : '白皮书文档正在准备中，即将上线。'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Samoa Trust Structure */}
        <div className="legal-box">
          <div className="d-flex align-items-center mb-3">
            <div className="compliance-icon me-3">
              <img 
                src="https://hpi-hub.tos-cn-beijing.volces.com/static/unknown-horizons-natural-resources-mines-icons/024.png" 
                alt="Trust Structure" 
                style={{ width: '40px', height: '40px' }} 
              />
            </div>
            <h3 className="legal-title">
              {language === 'en' ? 'Samoa Offshore Trust Structure' : '萨摩亚离岸信托结构'}
            </h3>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <p className="mb-4">
                {language === 'en' 
                  ? 'Our Samoa-based offshore trust structure ensures legal compliance while maximizing financial efficiency. This framework allows for clear asset segregation and provides the necessary legal protection for all stakeholders.'
                  : '我们的萨摩亚离岸信托结构确保法律合规性的同时最大化财务效率。这一框架允许明确的资产隔离，为所有利益相关者提供必要的法律保护。'
                }
              </p>
              
              <div className="trust-benefits">
                <h4 className="mb-3 h5">
                  {language === 'en' ? 'Key Benefits:' : '核心优势：'}
                </h4>
                <ul className="list-unstyled">
                  <li className="mb-2 d-flex align-items-center">
                    <span className="me-2">✓</span>
                    {language === 'en' ? 'Asset protection' : '资产保护'}
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <span className="me-2">✓</span>
                    {language === 'en' ? 'Privacy and confidentiality' : '隐私与保密性'}
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <span className="me-2">✓</span>
                    {language === 'en' ? 'Legal and tax efficiency' : '法律与税务效率'}
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <span className="me-2">✓</span>
                    {language === 'en' ? 'Regulatory compliance' : '监管合规性'}
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="structure-diagram p-3 bg-light rounded text-center">
                <img 
                  src="https://hpi-hub.tos-cn-beijing.volces.com/static/unknown-horizons-natural-resources-mines-icons/028.png" 
                  alt="Trust Structure Diagram" 
                  style={{ width: '46px', height: '46px', marginBottom: '15px' }}
                />
                <div className="diagram-box border p-3 mb-3 bg-white rounded">
                  <strong>{language === 'en' ? 'Trust Entity' : '信托实体'}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <div className="diagram-box border p-2 mb-3 bg-white rounded flex-grow-1 mx-1">
                    <small>{language === 'en' ? 'Asset Management' : '资产管理'}</small>
                  </div>
                  <div className="diagram-box border p-2 mb-3 bg-white rounded flex-grow-1 mx-1">
                    <small>{language === 'en' ? 'Singapore Custody' : '新加坡托管'}</small>
                  </div>
                </div>
                <div className="diagram-box border p-3 bg-white rounded">
                  <strong>{language === 'en' ? 'Chainlink Verification' : 'Chainlink验证'}</strong>
                </div>
                <p className="mt-3 small text-muted">
                  {language === 'en' 
                    ? 'Simplified structure diagram. For detailed information, please contact our compliance team.'
                    : '简化结构图。详细信息请联系我们的合规团队。'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Compliance;