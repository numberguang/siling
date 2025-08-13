import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faHome } from '@fortawesome/free-solid-svg-icons';
import { LanguageContext } from '../contexts/LanguageContext';

const NotFoundPage = () => {
  const { language } = useContext(LanguageContext);
  
  // 多语言文本内容
  const content = {
    en: {
      title: 'Page Not Found',
      message: 'Sorry, the page you are looking for does not exist.',
      backHome: 'Back to Home',
      errorCode: 'Error 404'
    },
    zh: {
      title: '页面未找到',
      message: '抱歉，您查找的页面不存在。',
      backHome: '返回首页',
      errorCode: '错误 404'
    }
  };
  
  // 当前语言内容
  const currentContent = content[language] || content.en;
  
  return (
    <div className="container-fluid animate__animated animate__fadeIn">
      <div className="row">
        <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3 text-center py-5">
          <div className="card shadow-lg border-0 rounded-lg mt-5">
            <div className="card-body p-5">
              {/* Error Icon */}
              <div className="mb-4">
                <FontAwesomeIcon 
                  icon={faExclamationTriangle} 
                  className="text-warning" 
                  style={{ fontSize: '5rem' }} 
                />
              </div>
              
              {/* Error Title */}
              <h1 className="display-4 fw-bold text-dark mb-3">
                {currentContent.errorCode}
              </h1>
              
              {/* Error Message */}
              <h2 className="h3 mb-4">{currentContent.title}</h2>
              <p className="lead mb-5">{currentContent.message}</p>
              
              {/* Back to Home Button */}
              <Link to="/" className="btn btn-primary btn-lg px-4">
                <FontAwesomeIcon icon={faHome} className="me-2" />
                {currentContent.backHome}
              </Link>
            </div>
            
            {/* Background Decoration */}
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
                 style={{ zIndex: -1, opacity: 0.05, overflow: 'hidden' }}>
              <div className="display-1 fw-bold" style={{ fontSize: '20rem' }}>404</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;