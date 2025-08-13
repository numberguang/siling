import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faGlobe, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { LanguageContext } from '../contexts/LanguageContext';

const Partners = () => {
  const { language } = useContext(LanguageContext);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 默认合作伙伴数据（使用用户提供的图片链接）
  const defaultPartners = [
    {
      id: 1,
      name: language === 'en' ? 'Binance' : '币安',
      logo: 'https://haisnap.tos-cn-beijing.volces.com/image/62df60be-38db-48c9-a441-9ae6c539293d_1755103736283.jpg',
      website: 'https://www.binance.com'
    },
    {
      id: 2,
      name: language === 'en' ? 'Victory Securities' : '胜利证券',
      logo: 'https://haisnap.tos-cn-beijing.volces.com/image/e83e1b02-fa38-4059-a33b-e82508e7e2f7_1755103746027.jpg',
      website: 'https://www.victorysec.com'
    },
    {
      id: 3,
      name: language === 'en' ? 'SlowMist' : '慢雾',
      logo: 'https://haisnap.tos-cn-beijing.volces.com/image/ca208787-a6eb-4c37-888d-9c0decf9311a_1755103751236.jpg',
      website: 'https://www.slowmist.com'
    },
    {
      id: 4,
      name: language === 'en' ? 'DBS Bank' : '星展银行',
      logo: 'https://haisnap.tos-cn-beijing.volces.com/image/987f17bb-c4a2-4aea-8ce5-ef51fd688b8b_1755103756738.jpg',
      website: 'https://www.dbs.com'
    },
    {
      id: 5,
      name: 'Protege Bank',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
      website: 'https://protege.com'
    },
    {
      id: 6,
      name: 'Chainlink',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
      website: 'https://chain.link'
    },
    {
      id: 7,
      name: language === 'en' ? 'RAK ICC' : 'RAK国际商业中心',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg',
      website: 'https://rakicc.com'
    }
  ];

  // 获取合作伙伴数据
  useEffect(() => {
    let isMounted = true;

    const fetchPartners = async () => {
      try {
        setLoading(true);
        setError(null);

        // 首先尝试从专用API接口获取数据
        try {
          const response = await axios.get('/api/partners', { 
            params: { lang: language },
            timeout: 5000
          });
          
          if (isMounted) {
            if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
              console.log('合作伙伴数据加载成功:', response.data);
              // 转换数据格式
              const formattedPartners = response.data.data.map(partner => ({
                id: partner.id,
                name: partner.name,
                logo: partner.logo_url,
                website: partner.website_url
              }));
              setPartners(formattedPartners);
            } else {
              console.log('API返回数据为空，使用默认数据');
              setPartners(defaultPartners);
            }
            setLoading(false);
          }
        } catch (apiError) {
          console.log('专用API调用失败，尝试通用API:', apiError.message);
          
          // 备用方案1：使用通用content API
          try {
            const fallbackResponse = await axios.get('/api/content', { 
              params: { lang: language },
              timeout: 3000
            });
            
            if (isMounted) {
              if (fallbackResponse.data && fallbackResponse.data.partners && fallbackResponse.data.partners.length > 0) {
                console.log('通用API获取合作伙伴数据成功');
                // 转换数据格式以匹配默认数据结构
                const formattedPartners = fallbackResponse.data.partners.map(partner => ({
                  id: partner.id,
                  name: partner.name,
                  logo: partner.logo_url,
                  website: partner.website_url
                }));
                setPartners(formattedPartners);
              } else {
                console.log('通用API无合作伙伴数据，使用默认数据');
                setPartners(defaultPartners);
              }
              setLoading(false);
            }
          } catch (fallbackError) {
            console.log('通用API也失败，使用默认数据:', fallbackError.message);
            
            // 备用方案2：直接使用默认数据
            if (isMounted) {
              setPartners(defaultPartners);
              setLoading(false);
            }
          }
        }
      } catch (error) {
        console.error('获取合作伙伴数据时出现意外错误:', error);
        
        if (isMounted) {
          // 最终备用方案：使用默认数据
          setPartners(defaultPartners);
          setError(null); // 不显示错误，直接使用默认数据
          setLoading(false);
        }
      }
    };

    // 使用短延迟确保组件已完全挂载
    const timer = setTimeout(() => {
      if (isMounted) {
        fetchPartners();
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [language]);

  // 加载状态
  if (loading) {
    return (
      <section className="partners py-5">
        <div className="container">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-primary mb-3" />
            <h3>{language === 'en' ? 'Loading partners...' : '加载合作伙伴中...'}</h3>
            <p className="text-muted">
              {language === 'en' 
                ? 'Please wait while we load our trusted partners...' 
                : '请稍候，我们正在加载信任的合作伙伴...'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="partners py-5">
      <div className="container">
        <div className="section-title text-center mb-5">
          <h2>
            <FontAwesomeIcon icon={faHandshake} className="me-2" />
            {language === 'en' ? 'Our Partners' : '合作伙伴'}
          </h2>
          <p className="text-muted lead">
            {language === 'en' 
              ? 'Global strategic partners that ensure our compliance and technological excellence' 
              : '确保我们合规与技术卓越的全球战略合作伙伴'}
          </p>
        </div>

        {/* 错误提示（如果有的话） */}
        {error && (
          <div className="alert alert-warning text-center mb-4">
            <FontAwesomeIcon icon={faHandshake} className="me-2" />
            {error}
          </div>
        )}

        {/* 合作伙伴网格 */}
        <div className="row justify-content-center">
          {partners && partners.length > 0 ? (
            partners.map((partner, index) => (
              <div 
                key={partner.id || index} 
                className="col-lg-3 col-md-4 col-sm-6 mb-4"
              >
                <div 
                  className="card h-100 shadow-sm border-0 partner-card animate__animated animate__fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-body text-center p-4 d-flex flex-column">
                    {/* Logo容器 */}
                    <div className="mb-4 d-flex justify-content-center align-items-center flex-grow-1" style={{ minHeight: '120px' }}>
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="img-fluid partner-logo" 
                        style={{ 
                          maxHeight: '80px', 
                          maxWidth: '100%', 
                          objectFit: 'contain',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          // 图片加载失败时的处理
                          console.warn(`图片加载失败: ${partner.logo}`);
                          e.target.style.display = 'none';
                          const parentDiv = e.target.parentNode;
                          if (parentDiv && !parentDiv.querySelector('.fallback-icon')) {
                            const fallbackDiv = document.createElement('div');
                            fallbackDiv.className = 'fallback-icon d-flex align-items-center justify-content-center';
                            fallbackDiv.style.cssText = 'height: 80px; background-color: #f8f9fa; border-radius: 8px; color: #0074D9; font-size: 2rem;';
                            fallbackDiv.innerHTML = '<i class="fas fa-building"></i>';
                            parentDiv.appendChild(fallbackDiv);
                          }
                        }}
                        onLoad={() => {
                          // 图片加载成功时确保显示
                          console.log(`图片加载成功: ${partner.name}`);
                        }}
                      />
                    </div>
                    
                    {/* 合作伙伴名称 */}
                    <h5 className="card-title text-primary mb-3 fw-bold">{partner.name}</h5>
                    
                    {/* 访问网站按钮 */}
                    {partner.website && (
                      <a 
                        href={partner.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-outline-primary mt-auto"
                        style={{ borderRadius: '25px' }}
                      >
                        <FontAwesomeIcon icon={faGlobe} className="me-2" />
                        {language === 'en' ? 'Visit Website' : '访问官网'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <FontAwesomeIcon icon={faHandshake} size="4x" className="text-muted mb-4" />
              <h4 className="text-muted">
                {language === 'en' ? 'No partners available at the moment.' : '暂时没有可用的合作伙伴。'}
              </h4>
            </div>
          )}
        </div>
        
        <p className="coming-soon text-center mt-5 text-muted fst-italic fs-5">
          {language === 'en' ? 'More partners coming soon...' : '更多合作机构陆续展示中...'}
        </p>
      </div>

      {/* 自定义样式 */}
      <style jsx>{`
        .partner-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 35px rgba(0, 31, 63, 0.15) !important;
        }
        
        .partner-card:hover .partner-logo {
          transform: scale(1.05);
        }
        
        .partner-card .card-body {
          border-radius: 12px;
        }
        
        @media (max-width: 768px) {
          .partner-card {
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Partners;