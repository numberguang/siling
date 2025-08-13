import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faExchangeAlt, 
  faBuilding, 
  faLock, 
  faChartLine, 
  faInfoCircle, 
  faFileContract,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { LanguageContext } from '../contexts/LanguageContext';
import axios from 'axios';

const Innovation = () => {
  const { language } = useContext(LanguageContext);
  const [contents, setContents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/content?lang=${language}`);
        
        if (response.data.contents && response.data.contents.innovation) {
          setContents(response.data.contents.innovation);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch innovation data:", err);
        setError(language === 'en' 
          ? "Failed to load innovation information. Please try again later." 
          : "加载创新信息失败，请稍后再试。");
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  if (loading) {
    return (
      <section id="innovation" className="innovation">
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
      <section id="innovation" className="innovation">
        <div className="container">
          <div className="section-title">
            <h2>{language === 'en' ? 'Key Innovations' : '关键创新'}</h2>
          </div>
          <div className="ntf-box">
            <p className="text-danger">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="innovation" className="innovation">
      <div className="container">
        <div className="section-title">
          <h2>{language === 'en' ? 'Key Innovations' : '关键创新'}</h2>
        </div>
        
        <div className="row">
          {/* NTF Explanation Section */}
          <div className="col-md-6">
            <div className="ntf-box animate__animated animate__fadeInLeft">
              <h3 className="mb-4 d-flex align-items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="me-3 text-primary" />
                {language === 'en' ? 'NTF (Non-securities Token Fragment)' : 'NTF（非证券化碎片）'}
              </h3>
              
              <div className="ntf-disclaimer mb-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                {contents.ntf_explanation || 
                  (language === 'en' 
                    ? 'NTF is only a certificate of beneficial interest in assets and does not constitute a securities investment' 
                    : 'NTF仅为资产收益权凭证，不构成证券投资'
                  )
                }
              </div>
              
              <h4 className="mb-3">{language === 'en' ? 'NTF vs Traditional Securities' : 'NTF与传统证券对比'}</h4>
              
              <div className="table-responsive mb-4">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>{language === 'en' ? 'Features' : '特性'}</th>
                      <th>{language === 'en' ? 'Traditional Securities' : '传统证券'}</th>
                      <th>NTF</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{language === 'en' ? 'Legal Status' : '法律属性'}</td>
                      <td>{language === 'en' ? 'Ownership rights' : '所有权'}</td>
                      <td>{language === 'en' ? 'Beneficial interest' : '收益权'}</td>
                    </tr>
                    <tr>
                      <td>{language === 'en' ? 'Underlying Assets' : '底层资产'}</td>
                      <td>{language === 'en' ? 'Company equity' : '公司股权'}</td>
                      <td>{language === 'en' ? 'Asset returns' : '资产收益'}</td>
                    </tr>
                    <tr>
                      <td>{language === 'en' ? 'Regulatory Jurisdiction' : '监管归属'}</td>
                      <td>{language === 'en' ? 'Securities Commission' : '证券委员会'}</td>
                      <td>{language === 'en' ? 'Digital Assets Authority' : '数字资产管理局'}</td>
                    </tr>
                    <tr>
                      <td>{language === 'en' ? 'Transfer Mechanism' : '转让机制'}</td>
                      <td>{language === 'en' ? 'Traditional exchanges' : '传统交易所'}</td>
                      <td>{language === 'en' ? 'Blockchain network' : '区块链网络'}</td>
                    </tr>
                    <tr>
                      <td>{language === 'en' ? 'Settlement Time' : '结算时间'}</td>
                      <td>{language === 'en' ? 'T+1/T+2 days' : 'T+1/T+2天'}</td>
                      <td>{language === 'en' ? 'Near-instant' : '近乎实时'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="ntf-benefits">
                <h4 className="mb-3">{language === 'en' ? 'Key Advantages' : '核心优势'}</h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <FontAwesomeIcon icon={faExchangeAlt} className="text-primary" />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h5 className="mb-1">{language === 'en' ? 'Enhanced Liquidity' : '增强流动性'}</h5>
                        <p className="small">{language === 'en' ? 'Fractional ownership enables smaller investments' : '碎片化所有权使更小额投资成为可能'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <FontAwesomeIcon icon={faShieldAlt} className="text-primary" />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h5 className="mb-1">{language === 'en' ? 'Regulatory Compliance' : '合规性'}</h5>
                        <p className="small">{language === 'en' ? 'Designed to meet global standards' : '设计符合全球标准'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Compliance Architecture Section */}
          <div className="col-md-6">
            <div className="ntf-box animate__animated animate__fadeInRight">
              <h3 className="mb-4 d-flex align-items-center">
                <FontAwesomeIcon icon={faBuilding} className="me-3 text-primary" />
                {language === 'en' ? 'Compliance Architecture' : '合规架构'}
              </h3>
              
              <h4 className="mb-3">{language === 'en' ? 'Samoa Offshore Trust Structure' : '萨摩亚离岸信托结构'}</h4>
              
              <div className="structure-img text-center mb-4">
                <div className="structure-diagram">
                  <div className="diagram-box border p-3 mb-3 bg-light rounded text-center">
                    <img 
                      src="https://hpi-hub.tos-cn-beijing.volces.com/static/gif/18-29-40-462_512.gif" 
                      alt="Trust Structure" 
                      style={{ width: '60px', height: '60px' }} 
                      className="mb-2"
                    />
                    <div>
                      <strong>{language === 'en' ? 'Pacific National Blockchain Finance Ltd' : 'Pacific National Blockchain Finance Ltd'}</strong>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-center gap-3 mb-3">
                    <div className="flex-grow-1 text-center">
                      <FontAwesomeIcon icon={faLock} size="lg" className="text-primary mb-2" />
                      <div className="diagram-box border p-2 rounded">
                        {language === 'en' ? 'Asset Trust' : '资产信托'}
                      </div>
                    </div>
                    <div className="flex-grow-1 text-center">
                      <FontAwesomeIcon icon={faFileContract} size="lg" className="text-primary mb-2" />
                      <div className="diagram-box border p-2 rounded">
                        {language === 'en' ? 'Operating Entity' : '运营实体'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="diagram-box border p-3 mb-3 bg-light rounded text-center">
                    <strong>{language === 'en' ? 'Singapore Custodian Bank + Chainlink Verification' : '新加坡托管银行 + Chainlink验证'}</strong>
                  </div>
                </div>
              </div>
              
              <h4 className="mb-3">{language === 'en' ? 'Fund Segregation' : '资金隔离'}</h4>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">
                        <FontAwesomeIcon icon={faBuilding} className="me-2 text-primary" />
                        {language === 'en' ? 'Singapore Custody' : '新加坡托管'}
                      </h5>
                      <p className="card-text">
                        {language === 'en'
                          ? 'All user funds are held in segregated accounts at licensed custodian banks in Singapore'
                          : '所有用户资金均存放在新加坡持牌托管银行的隔离账户中'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">
                        <img 
                          src="https://hpi-hub.tos-cn-beijing.volces.com/static/gif/01-21-03-962_512.gif" 
                          alt="Chainlink"
                          style={{ width: '20px', height: '20px', marginRight: '8px' }}
                        />
                        Chainlink {language === 'en' ? 'Verification' : '验证'}
                      </h5>
                      <p className="card-text">
                        {language === 'en'
                          ? 'Transparent on-chain proof of reserves through Chainlink oracle network'
                          : '通过Chainlink预言机网络提供透明的链上储备证明'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h4 className="mb-3">{language === 'en' ? 'Implementation Roadmap' : '实施路径'}</h4>
              
              <div className="timeline mb-3">
                <div className="timeline-item left">
                  <div className="timeline-content">
                    <div className="timeline-stage">{language === 'en' ? 'Stage 1 (Current)' : '阶段1（当前）'}</div>
                    <p>{language === 'en' ? 'MVP test version launch with 5 Hong Kong/US stock NTFs trading' : 'MVP测试版上线（5支港股/美股NTF交易）'}</p>
                  </div>
                </div>
                <div className="timeline-item right">
                  <div className="timeline-content">
                    <div className="timeline-stage">{language === 'en' ? 'Stage 2 (Policy Breakthrough)' : '阶段2（政策突破）'}</div>
                    <p>{language === 'en' ? 'Promoting the legislative process of "Digital Asset Sandbox Regulatory Ordinance"' : '推动《数字资产沙盒监管条例》立法进程'}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <img 
                  src="https://hpi-hub.tos-cn-beijing.volces.com/static/gif/03-42-09-623_512.gif" 
                  alt="Technology Growth"
                  style={{ width: '60px', height: '60px' }}
                />
                <p className="mt-2">
                  {language === 'en'
                    ? 'Continuous innovation to meet the evolving regulatory landscape'
                    : '持续创新以适应不断变化的监管环境'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Innovation;