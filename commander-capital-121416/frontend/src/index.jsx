import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

// 加载外部CSS
const loadExternalCSS = (url, id) => {
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }
};

// 加载字体
loadExternalCSS('https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Sans:wght@300;400;500;700&display=swap', 'noto-sans-font');

// 加载Animate.css
loadExternalCSS('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css', 'animate-css');

// 加载Bootstrap CSS
loadExternalCSS('https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css', 'bootstrap-css');

// 配置Font Awesome图标库
library.add(fas, fab);

// 配置axios默认设置
axios.defaults.baseURL = window.location.origin;
axios.defaults.headers.common['Accept'] = 'application/json';

// 创建LanguageContext
export const LanguageContext = React.createContext({
  language: 'en',
  setLanguage: () => {}
});

// 日志错误处理
const logError = (error) => {
  console.error('Application Error:', error);
  try {
    axios.post('/logs', {
      level: 'error',
      message: error.message || 'Unknown error',
      details: {
        stack: error.stack,
        timestamp: new Date().toISOString()
      }
    }).catch(e => console.error('Failed to log error:', e));
  } catch (e) {
    console.error('Error logging failed:', e);
  }
};

// 全局错误处理
window.addEventListener('error', (event) => {
  logError(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  logError(event.reason);
});

// 渲染React应用
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);