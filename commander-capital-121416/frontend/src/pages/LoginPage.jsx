import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faSignInAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { LanguageContext } from '../contexts/LanguageContext';

const LoginPage = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setIsAuthenticated(true);
      
      // Redirect to admin if already logged in
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/login', {
        username,
        password
      });

      const { token, user } = response.data;
      
      // Store token and user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setIsAuthenticated(true);
      
      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        language === 'en' 
          ? (err.response?.data?.error || 'Login failed. Please check your credentials.')
          : (err.response?.data?.error || '登录失败，请检查您的凭据。')
      );
    } finally {
      setLoading(false);
    }
  };

  // Translations
  const texts = {
    title: language === 'en' ? 'Login to Commander Capital' : '登录司令资本',
    username: language === 'en' ? 'Username' : '用户名',
    password: language === 'en' ? 'Password' : '密码',
    loginButton: language === 'en' ? 'Login' : '登录',
    goBack: language === 'en' ? 'Back to Home' : '返回首页',
    usernameRequired: language === 'en' ? 'Username is required' : '请输入用户名',
    passwordRequired: language === 'en' ? 'Password is required' : '请输入密码',
  };

  if (isAuthenticated) {
    return null; // Don't render anything if already authenticated (will redirect in useEffect)
  }

  return (
    <div className="container-fluid bg-dark text-light min-vh-100 d-flex align-items-center justify-content-center">
      <div className="blockchain-bg"></div>
      
      <div className="card bg-dark text-light border-secondary shadow p-4 animate__animated animate__fadeIn" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <img 
              src="https://hpi-hub.tos-cn-beijing.volces.com/static/gif/01-21-03-962_512.gif" 
              alt="Commander Capital Logo" 
              className="mb-3" 
              style={{ width: '80px', height: '80px' }} 
            />
            <h2 className="card-title">{texts.title}</h2>
          </div>
          
          {error && (
            <div className="alert alert-danger animate__animated animate__headShake" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-dark text-light border-secondary">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input 
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder={texts.username}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  aria-label={texts.username}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text bg-dark text-light border-secondary">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input 
                  type="password"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder={texts.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label={texts.password}
                />
              </div>
            </div>
            
            <div className="d-grid gap-2">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                    {texts.loginButton}
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-3">
            <Link to="/" className="text-info text-decoration-none">
              {texts.goBack}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;