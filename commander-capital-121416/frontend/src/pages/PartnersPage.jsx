import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faHandshake, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { LanguageContext } from '../contexts/LanguageContext';

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useContext(LanguageContext);

  // 默认合作伙伴数据（作为备用数据源）
  const defaultPartners = [
    {
      id: 1,
      name: language === 'en' ? 'Binance' : '币安',
      logo_url: 'https://haisnap.tos-cn-beijing.volces.com/image/10b13cb6-19ae-4f4d-a63a-2908af9e53c1_1755101569737.jpg',
      website_url: 'https://www.binance.com',
      display_order: 1
    },
    {
      id: 2,
      name: language === 'en' ? 'Victory Securities' : '胜利证券',
      logo_url: 'https://haisnap.tos-cn-beijing.volces.com/image/1b181d74-8c84-46ea-9c41-5109e98dbe98_1755101584290.jpg',
      website_url: 'https://www.victorysec.com',
      display_order: 2
    },
    {
      id: 3,
      name: language === 'en' ? 'SlowMist' : '慢雾',
      logo_url: 'https://haisnap.tos-cn-beijing.volces.com/image/1e26f30b-2765-4227-aeeb-bea62962d167_1755101595306.jpg',
      website_url: 'https://www.slowmist.com',
      display_order: 3
    },
    {
      id: 4,
      name: language === 'en' ? 'DBS Bank' : '星展银行',
      logo_url: 'https://haisnap.tos-cn-beijing.volces.com/image/3fe40e69-c108-4ce1-803c-1429478a8298_1755101602666.jpg',
      website_url: 'https://www.dbs.com',
      display_order: 4
    }
  ];

  // 获取合作伙伴数据
  useEffect(() => {
    let isMounted = true; // 防止组件卸载后的异步更新

    const fetchPartners = async () => {
      try {
        setLoading(true);
        setError(null);

        // 首先尝试从专用API接口获取数据
        try {
          const response = await axios.get('/api/partners', { 
            params: { lang: language },
            timeout: 5000 // 5秒超时
          });
          
          if (isMounted) {
            if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
              console.log('合作伙伴数据加载成功:', response.data);
              setPartners(response.data.data);
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
                  logo_url: partner.logo_url,
                  website_url: partner.website_url,
                  display_order: partner.display_order || 0
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

    // 清理函数
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [language]); // 只依赖language

  // 文本内容根据语言选择
  const texts = {
    title: language === 'en' ? 'Our Partners' : '我们的合作伙伴',
    subtitle: language === 'en' 
      ? 'Trusted by leading institutions worldwide' 
      : '全球领先机构的共同选择',
    visit: language === 'en' ? 'Visit Website' : '访问网站',
    loading: language === 'en' ? 'Loading partners...' : '加载合作伙伴中...',
    error: language === 'en' 
      ? 'Failed to load partners. Showing default partners.' 
      : '加载合作伙伴失败，显示默认合作伙伴。',
    comingSoon: language === 'en' 
      ? 'More partners coming soon...' 
      : '更多合作机构陆续展示中...',
    noPartners: language === 'en' 
      ? 'No partners available at the moment.' 
      : '暂时没有可用的合作伙伴。',
    getInTouch: language === 'en' ? 'Get in Touch' : '联系我们',
    cooperationTitle: language === 'en' ? 'Interested in Strategic Cooperation?' : '有兴趣进行战略合作?',
    cooperationDesc: language === 'en' 
      ? 'Contact us to explore partnership opportunities in blockchain finance and RWA solutions.' 
      : '联系我们，探索区块链金融和RWA解决方案的合作机会。'
  };

  // 加载状态
  if (loading) {
    return (
      <div className="partners-page py-5">
        <div className="container">
          <div className="text-center mt-5 pt-5">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-primary mb-3" />
            <h3>{texts.loading}</h3>
            <p className="text-muted">
              {language === 'en' 
                ? 'Please wait while we load our trusted partners...' 
                : '请稍候，我们正在加载信任的合作伙伴...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="partners-page py-5">
      <div className="container">
        {/* 头部区域 */}
        <div className="text-center mb-5 animate__animated animate__fadeIn">
          <h1 className="display-4 fw-bold text-primary mb-3">{texts.title}</h1>
          <p className="lead text-muted mb-4">{texts.subtitle}</p>
          <hr className="my-4 w-25 mx-auto border-primary" style={{ borderWidth: '2px' }} />
        </div>

        {/* 错误提示（如果有的话） */}
        {error && (
          <div className="alert alert-info text-center mb-4 animate__animated animate__fadeIn">
            <FontAwesomeIcon icon={faHandshake} className="me-2" />
            {texts.error}
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
                        src={partner.logo_url} 
                        alt={partner.name} 
                        className="img-fluid partner-logo" 
                        style={{ 
                          maxHeight: '100px', 
                          maxWidth: '100%', 
                          objectFit: 'contain',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          // 图片加载失败时的处理
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = `
                            <div class="d-flex align-items-center justify-content-center" style="height: 100px; background-color: #f8f9fa; border-radius: 8px;">
                              <i class="fas fa-building text-primary" style="font-size: 2rem;"></i>
                            </div>
                          `;
                        }}
                      />
                    </div>
                    
                    {/* 合作伙伴名称 */}
                    <h5 className="card-title text-primary mb-3 fw-bold">{partner.name}</h5>
                    
                    {/* 访问网站按钮 */}
                    {partner.website_url && (
                      <a 
                        href={partner.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-outline-primary mt-auto"
                        style={{ borderRadius: '25px' }}
                      >
                        <FontAwesomeIcon icon={faGlobe} className="me-2" />
                        {texts.visit}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <FontAwesomeIcon icon={faHandshake} size="4x" className="text-muted mb-4" />
              <h4 className="text-muted">{texts.noPartners}</h4>
            </div>
          )}
        </div>

        {/* 更多合作伙伴提示 */}
        <div className="text-center mt-5 animate__animated animate__fadeIn">
          <p className="text-muted fst-italic fs-5">{texts.comingSoon}</p>
        </div>

        {/* 战略合作部分 */}
        <div className="mt-5 pt-5 text-center animate__animated animate__fadeIn">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <FontAwesomeIcon icon={faHandshake} size="3x" className="text-primary mb-4" />
              <h2 className="h3 mb-4 text-primary">{texts.cooperationTitle}</h2>
              <p className="lead mb-4 text-muted">{texts.cooperationDesc}</p>
              <a 
                href="mailto:contact@siling.com" 
                className="btn btn-primary btn-lg px-5"
                style={{ borderRadius: '25px' }}
              >
                <FontAwesomeIcon icon={faGlobe} className="me-2" />
                {texts.getInTouch}
              </a>
            </div>
          </div>
        </div>
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
          .display-4 {
            font-size: 2rem;
          }
          
          .partner-card {
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PartnersPage;