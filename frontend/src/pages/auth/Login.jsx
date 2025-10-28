// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PrimaryButton, LinkButton } from '@/components/ui/Button';
import '@/assets/css/Login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
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

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

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
      newErrors.username = 'Username harus diisi';
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
      // Use login from AuthProvider
      await login(formData.username, formData.password);
      
      // Navigate to the page they tried to visit or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error scenarios
      let errorMessage = 'Login gagal. Silakan coba lagi.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Username atau password salah';
      } else if (error.response?.status === 403) {
        errorMessage = 'Akun Anda telah dinonaktifkan';
      } else if (error.response?.status === 429) {
        errorMessage = 'Terlalu banyak percobaan login. Silakan coba lagi nanti';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === 'Network Error') {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda';
      }
      
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
        <div className="flex flex-wrap items-center min-h-[70vh] justify-center">
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
                <h2 className="text-3xl font-bold" style={{ color: '#0000FF' }}>
                  Masuk Akun
                </h2>
                <p className="text-gray-600 mt-2">
                  Masuk untuk melanjutkan ke dashboard
                </p>
              </div>

              {errors.status && (
                <div className="alert-danger">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {errors.status}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Username Input */}
                <div className={`input-group-custom ${errors.username ? 'error' : ''}`}>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="NPM / NIM"
                    autoComplete="username"
                    disabled={isLoading}
                  />
                  <span className="input-icon">
                    <i className="fa-solid fa-user"></i>
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
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <span 
                    className="input-icon cursor-pointer" 
                    onClick={togglePasswordVisibility}
                    role="button"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </span>
                </div>
                {errors.password && <small className="error-text">{errors.password}</small>}

                {/* Submit Button */}
                <div className="mb-4 mt-6">
                  <PrimaryButton 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Memproses...
                      </span>
                    ) : (
                      'Masuk'
                    )}
                  </PrimaryButton>
                </div>

                {/* Back Link */}
                <div className="text-center mt-4">
                  <LinkButton 
                    onClick={() => navigate('/')} 
                    className="text-sm" 
                    disabled={isLoading}
                  >
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