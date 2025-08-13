import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';
import Business from './components/Business';
import Innovation from './components/Innovation';
import Compliance from './components/Compliance';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import ContactUs from './components/ContactUs';

// Import Contexts
import { LanguageContext } from './contexts/LanguageContext';

// Pages
import HomePage from './pages/HomePage';
import PartnersPage from './pages/PartnersPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

// Dynamic Background Component
const BlockchainBackground = () => {
  useEffect(() => {
    // Create blockchain nodes and connections
    const createBlockchainBackground = () => {
      const bg = document.querySelector('.blockchain-bg');
      if (!bg) return;
      
      // Clear existing nodes
      while (bg.firstChild) {
        bg.removeChild(bg.firstChild);
      }
      
      const nodes = [];
      const nodeCount = Math.min(20, window.innerWidth / 50); // Responsive node count
      
      // Create nodes
      for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.className = 'node';
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        
        bg.appendChild(node);
        nodes.push({ element: node, x, y });
      }
      
      // Create connections between nodes
      nodes.forEach((node, i) => {
        // Connect to 2-3 nearest nodes
        const connections = 2 + Math.floor(Math.random() * 2);
        
        // Sort other nodes by distance
        const otherNodes = [...nodes];
        otherNodes.splice(i, 1);
        otherNodes.sort((a, b) => {
          const distA = Math.sqrt(Math.pow(a.x - node.x, 2) + Math.pow(a.y - node.y, 2));
          const distB = Math.sqrt(Math.pow(b.x - node.x, 2) + Math.pow(b.y - node.y, 2));
          return distA - distB;
        });
        
        // Create connections to nearest nodes
        for (let j = 0; j < Math.min(connections, otherNodes.length); j++) {
          const target = otherNodes[j];
          const connection = document.createElement('div');
          connection.className = 'connection';
          
          // Calculate distance and angle
          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          
          // Position and rotate line
          connection.style.width = `${distance}px`;
          connection.style.left = `${node.x}px`;
          connection.style.top = `${node.y}px`;
          connection.style.transform = `rotate(${angle}deg)`;
          
          bg.appendChild(connection);
        }
      });
    };
    
    // Initial creation
    createBlockchainBackground();
    
    // Recreate on window resize
    const handleResize = () => {
      createBlockchainBackground();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <div className="blockchain-bg"></div>;
};

const App = () => {
  const [language, setLanguage] = useState(localStorage.getItem('preferredLanguage') || 'en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
    document.documentElement.lang = language;
  }, [language]);

  // Check API connection
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        await axios.get('/api/content');
        setLoading(false);
      } catch (err) {
        console.error("API connection error:", err);
        setError("Failed to connect to the server. Please try again later.");
        setLoading(false);
      }
    };

    checkApiConnection();
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div className="loading-screen d-flex align-items-center justify-content-center" style={{ height: '100vh', background: '#001F3F', color: 'white' }}>
        <div className="text-center">
          <FontAwesomeIcon icon={faSync} spin size="3x" className="mb-3" />
          <h3>{language === 'en' ? 'Loading...' : '加载中...'}</h3>
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="error-screen d-flex align-items-center justify-content-center" style={{ height: '100vh', background: '#001F3F', color: 'white' }}>
        <div className="text-center">
          <h3>{language === 'en' ? 'Connection Error' : '连接错误'}</h3>
          <p>{error}</p>
          <button 
            className="btn btn-light mt-3" 
            onClick={() => window.location.reload()}
          >
            {language === 'en' ? 'Retry' : '重试'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <Router>
        <div className="App">
          <BlockchainBackground />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/business" element={<Business />} />
              <Route path="/innovation" element={<Innovation />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/*" element={<AdminPage />} />
              {/* 修复：确保隐私政策、使用条款和联系我们路由正确配置 */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/terms" element={<Navigate to="/terms-of-use" replace />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
              {/* 404 处理 */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageContext.Provider>
  );
};

export default App;