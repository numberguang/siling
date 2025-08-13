import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faGlobe, faChartLine, faShieldAlt, faHandshake } from '@fortawesome/free-solid-svg-icons';
import { LanguageContext } from '../contexts/LanguageContext';

const HomePage = () => {
  const { language } = useContext(LanguageContext);
  const [content, setContent] = useState({
    hero: {},
    company: {},
    businessTypes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`/api/content?lang=${language}`);
        setContent({
          hero: response.data.contents.hero || {},
          company: response.data.company || {},
          businessTypes: response.data.businessTypes || []
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch content:", err);
        setLoading(false);
      }
    };

    fetchContent();
  }, [language]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section py-5 animate__animated animate__fadeIn">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold text-primary mb-3">
                {content.hero.main_title || (language === 'en' ? 'Global Real-World Asset (RWA) Liquidity Solutions' : '全球真实资产（RWA）流动性解决方案')}
              </h1>
              <p className="lead mb-4">
                {content.hero.subtitle || (language === 'en' ? 'Leading Blockchain Financial Innovation, Connecting Traditional Assets with the Digital World' : '引领区块链金融创新，连接传统资产与数字世界')}
              </p>
              <Link to="/business" className="btn btn-primary btn-lg">
                {language === 'en' ? 'Explore Our Services' : '探索我们的服务'} <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="hero-image-container p-3 rounded shadow-lg animate__animated animate__fadeInRight">
                <img 
                  src="https://haisnap.tos-cn-beijing.volces.com/image/82ba9506-f7e9-4993-bf13-c4d4bf9a5e3e_1755100402360.jpg" 
                  alt={language === 'en' ? 'RWA Blockchain Solutions' : 'RWA区块链解决方案'} 
                  className="img-fluid rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="business-types-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">
            {language === 'en' ? 'Our Core Business Areas' : '我们的核心业务领域'}
          </h2>
          <div className="row">
            {content.businessTypes.length > 0 ? (
              content.businessTypes.map((business, index) => (
                <div key={business.id || index} className="col-md-6 col-lg-3 mb-4">
                  <div className="card h-100 border-0 shadow-sm animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="card-body text-center">
                      <div className="mb-3">
                        <FontAwesomeIcon 
                          icon={
                            business.type_key === 'digital_asset_trading' ? faChartLine :
                            business.type_key === 'rwa_issuance' ? faGlobe :
                            business.type_key === 'blockchain_payment' ? faHandshake :
                            faShieldAlt
                          } 
                          size="3x" 
                          className="text-primary" 
                        />
                      </div>
                      <h5 className="card-title">{business.name}</h5>
                      <p className="card-text text-muted">{business.description}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback business types if API doesn't return data
              [
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
              ].map((business, index) => (
                <div key={business.id} className="col-md-6 col-lg-3 mb-4">
                  <div className="card h-100 border-0 shadow-sm animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="card-body text-center">
                      <div className="mb-3">
                        <FontAwesomeIcon 
                          icon={
                            business.type_key === 'digital_asset_trading' ? faChartLine :
                            business.type_key === 'rwa_issuance' ? faGlobe :
                            business.type_key === 'blockchain_payment' ? faHandshake :
                            faShieldAlt
                          } 
                          size="3x" 
                          className="text-primary" 
                        />
                      </div>
                      <h5 className="card-title">{business.name}</h5>
                      <p className="card-text text-muted">{business.description}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Company Section */}
      <section className="about-company-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="about-image-container p-3 rounded shadow-lg animate__animated animate__fadeInLeft">
                <img 
                  src="https://haisnap.tos-cn-beijing.volces.com/image/03ac28f1-507f-419c-99e8-9a3c35f843b7_1755100402451.jpg" 
                  alt={language === 'en' ? 'About Commander Capital' : '关于司令资本'} 
                  className="img-fluid rounded"
                />
              </div>
            </div>
            <div className="col-lg-6 animate__animated animate__fadeIn">
              <h2 className="mb-4">{language === 'en' ? 'About Commander Capital' : '关于司令资本'}</h2>
              <h4 className="text-primary mb-3">
                {content.company.name || (language === 'en' ? 'Commander Capital' : '司令 (Siling)')}
              </h4>
              <p className="mb-3">
                {language === 'en' 
                  ? 'Commander Capital is a leading blockchain financial services provider, dedicated to bridging the gap between traditional assets and digital finance through innovative RWA tokenization solutions.'
                  : '司令资本是领先的区块链金融服务提供商，致力于通过创新的RWA代币化解决方案连接传统资产与数字金融世界。'
                }
              </p>
              <p className="mb-4">
                {language === 'en'
                  ? 'Registered as Pacific National Blockchain Finance Ltd, we operate under the highest standards of compliance and innovation to deliver secure and efficient digital asset solutions for global clients.'
                  : '注册为Pacific National Blockchain Finance Ltd，我们在最高的合规和创新标准下运营，为全球客户提供安全高效的数字资产解决方案。'
                }
              </p>
              <Link to="/partners" className="btn btn-outline-primary">
                {language === 'en' ? 'Meet Our Partners' : '了解我们的合作伙伴'} <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section py-5 bg-primary text-white text-center">
        <div className="container">
          <h2 className="mb-4">
            {language === 'en' ? 'Ready to Transform Your Assets for the Digital Era?' : '准备好让您的资产迎接数字时代的转型了吗？'}
          </h2>
          <p className="lead mb-4">
            {language === 'en' 
              ? 'Contact our team to discuss how our RWA tokenization solutions can work for you.'
              : '联系我们的团队，了解我们的RWA代币化解决方案如何为您服务。'
            }
          </p>
          <a href="mailto:contact@siling.com" className="btn btn-light btn-lg">
            {language === 'en' ? 'Get in Touch' : '联系我们'}
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;