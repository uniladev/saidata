import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Button';

const DocumentValidation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    ticketNumber: '',
    token: ''
  });
  const [errors, setErrors] = useState({
    ticketNumber: '',
    token: '',
    status: ''
  });

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
    if (!formData.ticketNumber) {
      newErrors.ticketNumber = 'Nomor tiket harus diisi';
    } else if (formData.ticketNumber.length < 5) {
      newErrors.ticketNumber = 'Nomor tiket minimal 5 karakter';
    }
    
    if (!formData.token) {
      newErrors.token = 'Token validasi harus diisi';
    } else if (formData.token.length < 8) {
      newErrors.token = 'Token minimal 8 karakter';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form (placeholder - no action yet)
    setIsLoading(true);
    setErrors({ ticketNumber: '', token: '', status: '' });

    try {
      // TODO: API call akan ditambahkan nanti
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Success placeholder
      console.log('Validation check:', formData);
      alert('Validasi berhasil diproses!\nTiket: ' + formData.ticketNumber);
    } catch (error) {
      console.error('Validation error:', error);
      setErrors(prev => ({
        ...prev,
        status: 'Terjadi kesalahan saat memvalidasi dokumen. Silakan coba lagi.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-blue-600">Validasi Dokumen</h2>
                <p className="text-gray-600 mt-2 text-sm">
                  Masukkan nomor tiket dan token untuk mengecek status validasi dokumen Anda
                </p>
              </div>

              {errors.status && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {errors.status}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Ticket Number Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fa-solid fa-ticket mr-2 text-blue-600"></i>
                    Nomor Tiket
                  </label>
                  <input
                    type="text"
                    name="ticketNumber"
                    value={formData.ticketNumber}
                    onChange={handleChange}
                    placeholder="Contoh: TKT-20241014-001"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.ticketNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.ticketNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.ticketNumber}</p>
                  )}
                </div>

                {/* Token Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fa-solid fa-key mr-2 text-blue-600"></i>
                    Token Validasi
                  </label>
                  <input
                    type="text"
                    name="token"
                    value={formData.token}
                    onChange={handleChange}
                    placeholder="Masukkan token validasi"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.token ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.token && (
                    <p className="mt-1 text-sm text-red-600">{errors.token}</p>
                  )}
                </div>

                {/* Info Text */}
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <i className="fa-solid fa-info-circle text-blue-600 mr-2 mt-0.5 flex-shrink-0"></i>
                    <p className="text-sm text-blue-800 text-left">
                      Nomor tiket dan token diberikan saat Anda mengajukan validasi dokumen
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mb-4">
                  <PrimaryButton type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Mengecek Validasi...' : 'Cek Validasi'}
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentValidation;