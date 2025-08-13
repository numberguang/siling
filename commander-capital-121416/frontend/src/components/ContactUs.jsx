import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faPhone, faMapMarkerAlt, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { LanguageContext } from '../contexts/LanguageContext';

const ContactUs = () => {
  const { language } = useContext(LanguageContext);

  const content = {
    en: {
      title: "Contact Us",
      description: "If you have any questions or concerns about our services, please feel free to contact us. Our team is ready to assist you with professional blockchain financial solutions.",
      emailLabel: "Email us at:",
      emailAddress: "contact@siling.com",
      returnHome: "Return to Home Page",
      support: "Customer Support:",
      compliance: "Compliance Inquiries:",
      investment: "Investment Opportunities:",
      business: "Business Cooperation:",
      headquarters: "Headquarters",
      samoa: "Samoa Office",
      singapore: "Singapore Office",
      workingHours: "Working Hours",
      workingTime: "Monday - Friday: 9:00 AM - 6:00 PM (GMT+13)",
      emergency: "Emergency Contact",
      emergencyNote: "For urgent matters outside business hours",
      companyInfo: "Company Information",
      fullName: "Pacific National Blockchain Finance Ltd",
      registration: "Samoa Registration No: SA12345678",
      website: "Official Website: siling.com",
      getInTouch: "Get In Touch",
      contactNote: "We value every inquiry and will respond within 24 hours."
    },
    zh: {
      title: "联系我们",
      description: "如果您对我们的服务有任何问题或疑虑，请随时与我们联系。我们的团队随时准备为您提供专业的区块链金融解决方案。",
      emailLabel: "请发送邮件至：",
      emailAddress: "contact@siling.com",
      returnHome: "返回首页",
      support: "客户支持：",
      compliance: "合规咨询：",
      investment: "投资机会：",
      business: "商务合作：",
      headquarters: "总部地址",
      samoa: "萨摩亚办公室",
      singapore: "新加坡办公室",
      workingHours: "工作时间",
      workingTime: "周一至周五：上午9:00 - 下午6:00 (GMT+13)",
      emergency: "紧急联系",
      emergencyNote: "工作时间外的紧急事务联系",
      companyInfo: "公司信息",
      fullName: "Pacific National Blockchain Finance Ltd",
      registration: "萨摩亚注册编号：SA12345678",
      website: "官方网站：siling.com",
      getInTouch: "联系方式",
      contactNote: "我们重视每一个咨询，将在24小时内回复。"
    }
  };

  const currentContent = content[language];

  return (
    <div className="container py-5">
      <div className="contact-container animate__animated animate__fadeIn">
        <div className="contact-icon">
          <FontAwesomeIcon icon={faEnvelope} />
        </div>
        
        <h1 className="text-center mb-4">{currentContent.title}</h1>
        
        <p className="text-center mb-5 lead">
          {currentContent.description}
        </p>
        
        <div className="row">
          {/* Main Contact Section */}
          <div className="col-md-8 mx-auto">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">
                  <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                  {currentContent.getInTouch}
                </h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h5 className="text-tech-blue">{currentContent.support}</h5>
                    <p className="mb-1">
                      <a href="mailto:support@siling.com" className="text-decoration-none">
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                        support@siling.com
                      </a>
                    </p>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <h5 className="text-tech-blue">{currentContent.compliance}</h5>
                    <p className="mb-1">
                      <a href="mailto:compliance@siling.com" className="text-decoration-none">
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                        compliance@siling.com
                      </a>
                    </p>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <h5 className="text-tech-blue">{currentContent.investment}</h5>
                    <p className="mb-1">
                      <a href="mailto:invest@siling.com" className="text-decoration-none">
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                        invest@siling.com
                      </a>
                    </p>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <h5 className="text-tech-blue">{currentContent.business}</h5>
                    <p className="mb-1">
                      <a href="mailto:business@siling.com" className="text-decoration-none">
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                        business@siling.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Company Information */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                      {currentContent.headquarters}
                    </h5>
                  </div>
                  <div className="card-body">
                    <p className="mb-2">
                      <strong>{currentContent.samoa}</strong><br />
                      Level 2, Savalalo Center<br />
                      Apia, Samoa
                    </p>
                    <p className="mb-0">
                      <strong>{currentContent.singapore}</strong><br />
                      1 Raffles Place, #20-61<br />
                      Singapore 048616
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">
                      <FontAwesomeIcon icon={faGlobe} className="me-2" />
                      {currentContent.companyInfo}
                    </h5>
                  </div>
                  <div className="card-body">
                    <p className="mb-2">{currentContent.fullName}</p>
                    <p className="mb-2">{currentContent.registration}</p>
                    <p className="mb-2">{currentContent.website}</p>
                    <p className="mb-0">
                      <strong>{currentContent.workingHours}</strong><br />
                      {currentContent.workingTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div className="alert alert-info">
              <h6 className="alert-heading">
                <FontAwesomeIcon icon={faPhone} className="me-2" />
                {currentContent.emergency}
              </h6>
              <p className="mb-2">{currentContent.emergencyNote}</p>
              <a href="mailto:emergency@siling.com" className="alert-link">emergency@siling.com</a>
            </div>
            
            {/* Contact Note */}
            <div className="text-center mb-4">
              <div className="alert alert-success">
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                {currentContent.contactNote}
              </div>
            </div>
            
            {/* Main Contact Button */}
            <div className="text-center mb-4">
              <a 
                href="mailto:contact@siling.com?subject=Inquiry from siling.com&body=Dear Commander Capital Team,%0D%0A%0D%0AI would like to inquire about..." 
                className="btn btn-primary btn-lg px-5 py-3"
              >
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                {currentContent.emailAddress}
              </a>
            </div>
            
            {/* Return Home Button */}
            <div className="text-center">
              <Link to="/" className="btn btn-outline-primary">
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                {currentContent.returnHome}
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Compliance Alert */}
      <div className="compliance-alert">
        ▶ {language === 'en' ? 
          'You are accessing services of Pacific National Blockchain Finance Ltd (Samoa Registration No. SA12345678), prohibited for domestic residents. NTF is not a securities product, see ' : 
          '您正在访问Pacific National Blockchain Finance Ltd（萨摩亚注册编号SA12345678）服务，禁止境内居民使用。NTF非证券产品，详情见'}
        <Link to="/privacy-policy" className="text-decoration-none">
          {language === 'en' ? 'Disclaimer' : '免责声明'}
        </Link>.
      </div>
    </div>
  );
};

export default ContactUs;