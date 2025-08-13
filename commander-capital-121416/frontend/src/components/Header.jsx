import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faTimes, 
  faGlobe, 
  faChartLine, 
  faShieldAlt, 
  faHandshake,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { LanguageContext } from '../contexts/LanguageContext';

const Header = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: language === 'en' ? 'Commander Capital' : '司令 (Siling)',
    domain: 'siling.com'
  });
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Update company info when language changes
  useEffect(() => {
    setCompanyInfo({
      name: language === 'en' ? 'Commander Capital' : '司令 (Siling)',
      domain: 'siling.com'
    });
  }, [language]);

  // Logo preload and fallback mechanism
  useEffect(() => {
    const preloadLogo = () => {
      const logoUrl = "https://hpi-hub.tos-cn-beijing.volces.com/static/gif/03-19-26-213_512.gif";
      
      // Create image preload
      const img = new Image();
      img.onload = () => {
        setLogoLoaded(true);
      };
      img.onerror = () => {
        console.warn('Logo failed to load, using fallback');
        setLogoLoaded(false);
      };
      
      // Add cache-busting parameter to prevent cache issues
      img.src = `${logoUrl}?t=${Date.now()}`;
    };

    preloadLogo();

    // Re-preload on page visibility change (handles refresh scenarios)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        preloadLogo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Change language
  const toggleLanguage = (lang) => {
    if (lang !== language) {
      setLanguage(lang);
    }
  };

  // Navigation items with i18n
  const navItems = [
    { 
      id: 'home', 
      path: '/', 
      titleEn: 'Home', 
      titleZh: '首页',
      icon: faHome
    },
    { 
      id: 'business', 
      path: '/business', 
      titleEn: 'Business', 
      titleZh: '业务',
      icon: faChartLine
    },
    { 
      id: 'innovation', 
      path: '/innovation', 
      titleEn: 'Innovation', 
      titleZh: '创新',
      icon: faGlobe
    },
    { 
      id: 'compliance', 
      path: '/compliance', 
      titleEn: 'Compliance', 
      titleZh: '合规',
      icon: faShieldAlt
    },
    { 
      id: 'partners', 
      path: '/partners', 
      titleEn: 'Partners', 
      titleZh: '合作',
      icon: faHandshake
    }
  ];

  // Logo URL with cache-busting and fallback
  const getLogoUrl = () => {
    const baseUrl = "https://hpi-hub.tos-cn-beijing.volces.com/static/gif/03-19-26-213_512.gif";
    
    // Add timestamp to prevent caching issues on refresh
    const timestamp = Math.floor(Date.now() / 60000); // Update every minute
    return `${baseUrl}?v=${timestamp}`;
  };

  // Fallback logo component
  const LogoFallback = () => (
    <div 
      style={{
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0074D9, #7FDBFF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginRight: '12px',
        border: '2px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      C
    </div>
  );

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-container">
            {/* Brand Logo and Name */}
            <Link to="/" className="navbar-brand">
              {logoLoaded ? (
                <img 
                  src={getLogoUrl()} 
                  alt="Commander Capital Logo" 
                  className="navbar-logo"
                  onError={(e) => {
                    console.warn('Logo load error, switching to fallback');
                    setLogoLoaded(false);
                  }}
                  style={{
                    width: '45px',
                    height: '45px',
                    marginRight: '12px',
                    borderRadius: '50%',
                    transition: 'transform 0.3s ease',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <LogoFallback />
              )}
              <span className="brand-text">{companyInfo.name}</span>
            </Link>

            {/* Mobile Toggle Button */}
            <button 
              className="navbar-toggler d-lg-none" 
              type="button" 
              onClick={toggleMenu}
              aria-label={language === 'en' ? 'Toggle navigation' : '切换导航'}
            >
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
            </button>

            {/* Navigation Items - Optimized horizontal layout */}
            <div className={`navbar-collapse ${menuOpen ? 'show' : ''}`}>
              <ul className="navbar-nav">
                {navItems.map(item => (
                  <li className="nav-item" key={item.id}>
                    <Link 
                      to={item.path} 
                      className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                      <span className="nav-text">
                        {language === 'en' ? item.titleEn : item.titleZh}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Language Switcher */}
              <div className="lang-switch">
                <button 
                  className={`lang-btn ${language === 'en' ? 'active' : ''}`} 
                  onClick={() => toggleLanguage('en')}
                  type="button"
                >
                  EN
                </button>
                <span className="lang-divider"></span>
                <button 
                  className={`lang-btn ${language === 'zh' ? 'active' : ''}`} 
                  onClick={() => toggleLanguage('zh')}
                  type="button"
                >
                  中文
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Domain display in header (as per requirements) */}
        <div className="domain-display">
          <div className="container">
            <small className="domain-text">{companyInfo.domain}</small>
          </div>
        </div>
      </header>

      {/* Inline styles for enhanced navigation */}
      <style jsx>{`
        .navbar {
          background: linear-gradient(135deg, var(--primary-blue) 0%, #002852 100%) !important;
          color: #ffffff !important;
          padding: 0 !important;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(0, 31, 63, 0.4);
          backdrop-filter: blur(15px);
          transition: all 0.3s ease;
        }

        .navbar.scrolled {
          background: rgba(0, 31, 63, 0.95) !important;
          backdrop-filter: blur(20px);
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          position: relative;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #ffffff !important;
          font-size: 1.5rem;
          font-weight: 700;
          transition: all 0.3s ease;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .navbar-brand:hover {
          color: #7FDBFF !important;
          transform: translateY(-2px);
        }

        .navbar-logo {
          height: 45px;
          width: 45px;
          margin-right: 12px;
          border-radius: 50%;
          transition: transform 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .navbar-brand:hover .navbar-logo {
          transform: rotate(360deg);
          border-color: #7FDBFF;
        }

        .brand-text {
          font-family: 'Noto Sans SC', 'Noto Sans', sans-serif;
          letter-spacing: 0.5px;
        }

        .navbar-toggler {
          background: none;
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .navbar-toggler:hover {
          border-color: #ffffff;
          background-color: rgba(255, 255, 255, 0.1);
          color: #7FDBFF;
        }

        .navbar-collapse {
          display: flex;
          align-items: center;
        }

        .navbar-nav {
          display: flex;
          flex-direction: row; /* 确保横向排列 */
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
          gap: 1rem; /* 设置导航项之间的间距 */
          flex-wrap: nowrap; /* 防止导航项换行 */
        }

        .nav-item {
          margin: 0; /* 移除默认外边距 */
        }

        .nav-link {
          display: flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.9) !important;
          text-decoration: none;
          font-weight: 500;
          font-size: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: #FFD700;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-link:hover {
          color: #ffffff !important;
          background-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .nav-link:hover::before,
        .nav-link.active::before {
          width: 80%;
        }

        .nav-link.active {
          color: #ffffff !important;
          background-color: rgba(0, 116, 217, 0.3);
          font-weight: 600;
        }

        .nav-icon {
          margin-right: 0.5rem;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .nav-text {
          font-family: 'Noto Sans SC', 'Noto Sans', sans-serif;
        }

        .lang-switch {
          display: flex;
          align-items: center;
          margin-left: 2rem;
          background-color: rgba(255, 255, 255, 0.15);
          border-radius: 25px;
          padding: 0.25rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .lang-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }

        .lang-btn:hover {
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.1);
        }

        .lang-btn.active {
          color: var(--primary-blue);
          background-color: #ffffff;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .lang-divider {
          width: 1px;
          height: 20px;
          background-color: rgba(255, 255, 255, 0.3);
          margin: 0 0.25rem;
        }

        .domain-display {
          background-color: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(5px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.5rem 0;
          text-align: center;
        }

        .domain-text {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          letter-spacing: 1px;
          font-family: 'Courier New', monospace;
        }

        /* Mobile Responsive */
        @media (max-width: 991.98px) {
          .navbar-collapse {
            position: fixed;
            top: 100%;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, var(--primary-blue) 0%, #002852 100%);
            height: 0;
            overflow: hidden;
            transition: all 0.3s ease;
            flex-direction: column;
            align-items: flex-start;
            padding: 0;
            box-shadow: 0 10px 30px rgba(0, 31, 63, 0.6);
            backdrop-filter: blur(20px);
            z-index: 999;
          }

          .navbar-collapse.show {
            height: auto;
            padding: 2rem 1rem;
          }

          .navbar-nav {
            flex-direction: column; /* 移动端改为纵向布局 */
            width: 100%;
            gap: 0.5rem;
          }

          .nav-item {
            margin: 0;
            width: 100%;
          }

          .nav-link {
            width: 100%;
            justify-content: flex-start;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-size: 1.1rem;
          }

          .nav-link::before {
            display: none;
          }

          .nav-link:hover,
          .nav-link.active {
            background-color: rgba(255, 255, 255, 0.2);
            transform: translateX(10px);
          }

          .nav-icon {
            margin-right: 1rem;
            font-size: 1.1rem;
          }

          .lang-switch {
            margin: 1.5rem auto 0;
            align-self: center;
          }

          .domain-display {
            display: none;
          }
        }

        @media (max-width: 575.98px) {
          .navbar-brand {
            font-size: 1.3rem;
          }

          .brand-text {
            display: none;
          }

          .navbar-logo {
            height: 40px;
            width: 40px;
            margin-right: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Header;