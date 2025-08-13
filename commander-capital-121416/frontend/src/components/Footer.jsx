import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faEnvelope, faShieldAlt, faBalanceScale } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { LanguageContext } from '../contexts/LanguageContext';

const Footer = () => {
  const { language } = useContext(LanguageContext);
  const currentYear = new Date().getFullYear();

  const footerText = {
    company: {
      en: 'Commander Capital',
      zh: '司令 (Siling)'
    },
    fullName: {
      en: 'Pacific National Blockchain Finance Ltd',
      zh: 'Pacific National Blockchain Finance Ltd'
    },
    links: {
      en: 'Quick Links',
      zh: '快速链接'
    },
    legal: {
      en: 'Legal',
      zh: '法律'
    },
    privacy: {
      en: 'Privacy Policy',
      zh: '隐私政策'
    },
    terms: {
      en: 'Terms of Use',
      zh: '使用条款'
    },
    contact: {
      en: 'Contact',
      zh: '联系我们'
    },
    copyright: {
      en: 'All Rights Reserved',
      zh: '版权所有'
    },
    compliance: {
      en: 'Compliance',
      zh: '合规'
    },
    innovation: {
      en: 'Innovation',
      zh: '创新'
    },
    partners: {
      en: 'Partners',
      zh: '合作伙伴'
    },
    disclaimer: {
      en: 'Not available in restricted regions. For qualified investors only.',
      zh: '在受限制地区不可用。仅适用于合格投资者。'
    }
  };

  return (
    <footer className="bg-dark text-white py-5">
      <div className="container animate__animated animate__fadeIn">
        <div className="row">
          {/* Company Info */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="mb-3 text-primary">{footerText.company[language]}</h5>
            <p className="mb-1">{footerText.fullName[language]}</p>
            <div className="d-flex mt-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="me-3 text-light">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="me-3 text-light">
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="mb-3">{footerText.links[language]}</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/business" className="text-light text-decoration-none">
                  <FontAwesomeIcon icon={faGlobe} className="me-2" />
                  {language === 'en' ? 'Business' : '业务'}
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/innovation" className="text-light text-decoration-none">
                  <FontAwesomeIcon icon={faGlobe} className="me-2" />
                  {footerText.innovation[language]}
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-light text-decoration-none">
                  <FontAwesomeIcon icon={faGlobe} className="me-2" />
                  {footerText.partners[language]}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="mb-3">{footerText.legal[language]}</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/privacy" className="text-light text-decoration-none">
                  <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                  {footerText.privacy[language]}
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="text-light text-decoration-none">
                  <FontAwesomeIcon icon={faBalanceScale} className="me-2" />
                  {footerText.terms[language]}
                </Link>
              </li>
              <li>
                <Link to="/compliance" className="text-light text-decoration-none">
                  <FontAwesomeIcon icon={faBalanceScale} className="me-2" />
                  {footerText.compliance[language]}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-2">
            <h5 className="mb-3">{footerText.contact[language]}</h5>
            <p>
              <a href="mailto:contact@siling.com" className="text-light text-decoration-none">
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                contact@siling.com
              </a>
            </p>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">&copy; {currentYear} {footerText.company[language]}. {footerText.copyright[language]}.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <small className="text-muted">{footerText.disclaimer[language]}</small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;