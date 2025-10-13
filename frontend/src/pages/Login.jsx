// frontend/src/pages/Login.jsx (Axios version)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PrimaryButton, OutlineButton, LinkButton } from '../components/ui/Button';
import api, { setAccessToken } from '../config/api';
import '../assets/css/Login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    status: ''
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    let newErrors = {};
    if (!formData.username) {
      newErrors.username = 'username harus diisi';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
    setIsLoading(true);
    setErrors({ username: '', password: '', status: '' });

    try {
      const { data } = await api.post('/auth/login', {
        username: formData.username,
        password: formData.password
      });

      // Store access token in memory
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
      }

      // Optional: Store user data if returned
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Navigate to dashboard or home
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Login gagal. Silakan coba lagi.';
      
      setErrors(prev => ({
        ...prev,
        status: errorMessage
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Header */}
      <div className="login-header">
        <div className="container mx-auto px-4 py-3 flex justify-center items-center">
          <div className="brand-logo">
            <Link to="/">
              <img 
                src="/images/logo/color.webp" 
                alt="Logo"
                style={{ 
                  maxWidth: '50px', 
                  width: '100%', 
                  height: 'auto', 
                  margin: '0 auto',
                  objectFit: 'contain'
                }}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="flex flex-wrap items-center min-h-[70vh]">
          {/* Illustration - Hidden on mobile */}
          <div className="hidden lg:block w-full lg:w-7/12 md:w-6/12 px-4 mb-8 lg:mb-0">
            <div className="text-center illustration-container">
              <img 
                src="/images/bg-login.webp" 
                alt="Login Illustration" 
                style={{ 
                  maxWidth: '550px', 
                  width: '100%', 
                  height: 'auto', 
                  margin: '0 auto',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>

          {/* Login Form - Full width on mobile */}
          <div className="w-full lg:w-5/12 md:w-6/12 px-2 md:px-4">
            <div className="login-box p-6 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold" style={{ color: '#0000FF' }}>Masuk Akun</h2>
              </div>

              {errors.status && (
                <div className="alert-danger">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {errors.status}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* username Input */}
                <div className={`input-group-custom ${errors.username ? 'error' : ''}`}>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="NPM / NIM"
                    disabled={isLoading}
                  />
                  <span className="input-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </span>
                </div>
                {errors.username && <small className="error-text">{errors.username}</small>}

                {/* Password Input */}
                <div className={`input-group-custom mt-2 ${errors.password ? 'error' : ''}`}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Kata Sandi"
                    disabled={isLoading}
                  />
                  <span className="input-icon" onClick={togglePasswordVisibility}>
                    <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </span>
                </div>
                {errors.password && <small className="error-text">{errors.password}</small>}

                {/* Forgot Password */}
                <div className="text-right mt-2 mb-8">
                  <Link to="/forgot-password" className="text-sm font-medium hover:underline" style={{ color: '#0000FF' }}>
                    Lupa Kata Sandi?
                  </Link>
                </div>

                {/* Submit Button */}
                <div className="mb-4">
                  <PrimaryButton type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Memproses...' : 'Masuk'}
                  </PrimaryButton>
                </div>

                {/* Divider */}
                <div className="text-center my-4" style={{ color: '#707373', fontWeight: 600 }}>
                  ATAU
                </div>

                {/* Register Link */}
                <div className="mb-4">
                  <OutlineButton 
                    className="w-full"
                    onClick={() => navigate('/register')}
                    disabled={isLoading}
                  >
                    Daftar Akun
                  </OutlineButton>
                </div>

                {/* Back Link */}
                <div className="text-center mt-2 mb-8">
                  <LinkButton onClick={() => navigate('/')} className="text-sm" disabled={isLoading}>
                    Kembali ke Beranda
                  </LinkButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;