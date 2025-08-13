import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExchangeAlt, 
  faChartLine, 
  faGlobe, 
  faCode, 
  faArrowRight,
  faMoneyBillWave,
  faHandshake,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
import { LanguageContext } from '../contexts/LanguageContext';
import axios from 'axios';

const Business = () => {
  const { language } = useContext(LanguageContext);
  const [contents, setContents] = useState({});
  const [businessTypes, setBusinessTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 业务流程步骤
  const processSteps = [
    {
      icon: faMoneyBillWave,
      titleEn: 'User Deposit',
      titleZh: '用户充值',
      descEn: 'Users deposit funds into segregated accounts',
      descZh: '用户向隔离账户充值资金'
    },
    {
      icon: faExchangeAlt,
      titleEn: 'Purchase NTF',
      titleZh: '购买NTF',
      descEn: 'Users purchase NTF through the platform',
      descZh: '用户通过平台购买NTF'
    },
    {
      icon: faBuilding,
      titleEn: 'Asset Anchoring',
      titleZh: '资产锚定',
      descEn: 'NTF is anchored to real-world assets',
      descZh: 'NTF与真实世界资产锚定'
    },
    {
      icon: faHandshake,
      titleEn: 'Income Distribution',
      titleZh: '收益分配',
      descEn: 'Asset returns are distributed to NTF holders',
      descZh: '资产收益分配给NTF持有者'
    }
  ];

  // 业务图标映射
  const businessIcons = {
    digital_asset_trading: faExchangeAlt,
    rwa_issuance: faChartLine,
    blockchain_payment: faGlobe,
    fintech_development: faCode
  };

  // 业务图标动画GIF映射
  const businessGifs = {
    digital_asset_trading: "https://hpi-hub.tos-cn-beijing.volces.com/static/gif/01-21-03-962_512.gif",
    rwa_issuance: "https://hpi-hub.tos-cn-beijing.volces.com/static/gif/01-37-51-884_512.gif",
    blockchain_payment: "https://hpi-hub.tos-cn-beijing.volces.com/static/gif/03-30-33-674_512.gif",
    fintech_development: "https://hpi-hub.tos-cn-beijing.volces.com/static/gif/03-42-09-623_512.gif"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/content?lang=${language}`);
        
        if (response.data.contents && response.data.contents.business) {
          setContents(response.data.contents.business);
        }
        
        if (response.data.businessTypes && response.data.businessTypes.length > 0) {
          setBusinessTypes(response.data.businessTypes);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch business data:", err);
        setError(language === 'en' 
          ? "Failed to load business information. Please try again later." 
          : "加载业务信息失败，请稍后再试。");
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  if (loading) {
    return (
      <section id="business" className="business">
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
      <section id="business" className="business">
        <div className="container">
          <div className="section-title">
            <h2>{language === 'en' ? 'Business Services' : '业务服务'}</h2>
          </div>
          <div className="business-card">
            <p className="text-danger">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // 如果API未返回业务类型，使用默认值
  const displayBusinessTypes = businessTypes.length > 0 ? businessTypes : [
    {
      id: 1,
      type_key: 'digital_asset_trading',
      name: language === 'en' ? 'Digital Asset Trading Platform' : '数字资产交易平台',
      description: language === 'en' ? 'Including equity tokenization, emphasizing the non-securities nature of NTF' : '含股权代币化，强调NTF非证券化属性'
    },
    {
      id: 2,
      type_key: 'rwa_issuance',
      name: language === 'en' ? 'RWA Digital Issuance' : 'RWA数字化发行',
      description: language === 'en' ? 'Linking to "real estate/private equity anchoring" cases' : '关联"房地产/私募股权锚定"案例'
    },
    {
      id: 3,
      type_key: 'blockchain_payment',
      name: language === 'en' ? 'Blockchain Cross-border Payment' : '区块链跨境支付',
      description: language === 'en' ? 'Highlighting "second-level settlement, compliant channels"' : '突出"秒级结算、合规通道"'
    },
    {
      id: 4,
      type_key: 'fintech_development',
      name: language === 'en' ? 'Digital Financial Technology Development' : '数字金融技术开发',
      description: language === 'en' ? 'Providing white-label systems for licensed institutions' : '为持牌机构提供白标系统'
    }
  ];

  return (
    <section id="business" className="business">
      <div className="container">
        <div className="section-title">
          <h2>{language === 'en' ? 'Business Services' : '业务服务'}</h2>
        </div>
        
        <div className="row">
          {displayBusinessTypes.map((business) => (
            <div className="col-lg-3 col-md-6" key={business.id || business.type_key}>
              <div className="business-card animate__animated animate__fadeInUp">
                <div className="business-icon">
                  {businessGifs[business.type_key] ? (
                    <img 
                      src={businessGifs[business.type_key]} 
                      alt={business.name} 
                      style={{ width: '40px', height: '40px' }} 
                    />
                  ) : (
                    <FontAwesomeIcon 
                      icon={businessIcons[business.type_key] || faChartLine} 
                      size="2x" 
                    />
                  )}
                </div>
                <h3 className="business-title">{business.name}</h3>
                <p className="business-desc">{business.description}</p>
                <a href="#" className="business-link">
                  {language === 'en' ? 'Learn More' : '了解更多'}
                  <FontAwesomeIcon icon={faArrowRight} />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {/* Business Process Flow */}
        <div className="mt-5">
          <div className="section-title mb-4">
            <h3>{language === 'en' ? 'Business Process' : '业务流程'}</h3>
          </div>
          
          <div className="process-flow">
            <div className="process-connector"></div>
            {processSteps.map((step, index) => (
              <div className="process-step animate__animated animate__fadeInLeft" key={index} style={{animationDelay: `${index * 0.2}s`}}>
                <div className="process-icon">
                  <FontAwesomeIcon icon={step.icon} />
                </div>
                <div className="process-content">
                  <h4 className="process-title">
                    {language === 'en' ? step.titleEn : step.titleZh}
                  </h4>
                  <p className="process-desc">
                    {language === 'en' ? step.descEn : step.descZh}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-5">
            <img 
              src="https://hpi-hub.tos-cn-beijing.volces.com/static/gif/18-29-40-462_512.gif" 
              alt="Blockchain Network" 
              style={{ width: '80px', height: '80px', opacity: '0.7' }}
            />
            <h4 className="mt-3">
              {language === 'en' 
                ? 'Secure, Transparent and Compliant RWA Solutions' 
                : '安全、透明且合规的RWA解决方案'}
            </h4>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="row mt-5">
          <div className="col-md-8 offset-md-2">
            <div className="card bg-light p-4 text-center">
              <h3 className="mb-3">
                {language === 'en' 
                  ? 'Ready to Explore Real World Asset Tokenization?' 
                  : '准备探索真实资产代币化？'}
              </h3>
              <p className="mb-4">
                {language === 'en' 
                  ? 'Join us to unlock new possibilities in digital finance with regulatory compliant solutions.' 
                  : '加入我们，通过合规解决方案解锁数字金融的新可能性。'}
              </p>
              <div>
                <a href="#contact" className="btn btn-primary mx-2">
                  {language === 'en' ? 'Contact Us' : '联系我们'}
                </a>
                <a href="#innovation" className="btn btn-outline mx-2">
                  {language === 'en' ? 'Learn About NTF' : '了解NTF'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Business;