// frontend/src/pages/authenticated/Admin/TablePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import api from '../../../../config/api';

// === 2. "OTAK" TABEL (KOLOM DINAMIS) ===
// 'key' adalah nama properti di dummyData
// 'label' adalah teks yang akan tampil di header tabel
const columns = [
  { key: 'title', label: 'Nama Prestasi' },
  { key: 'type', label: 'Tingkat' },
  { key: 'is_active', label: 'Capaian' },
  { key: 'created_by', label: 'Jenis' },
  { key: 'updated_by', label: 'Dosen Pembimbing' },
  { key: 'created_at', label: 'Tanggal' },
];

const TablePage = () => {
  const navigate = useNavigate();

  // === STATE MANAGEMENT ===
  const [prestasiList, setPrestasiList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  // === DATA FETCHING ===

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('submissions/{id}');
        // The backend returns { success, data: [...] }
        setPrestasiList(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        setPrestasiList([]);
        alert('Gagal mengambil data dari server.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // === DATA MANIPULATION (LOGIC) ===

  // 1. Filter data (dinamis berdasarkan array 'columns')
  const filteredPrestasi = prestasiList.filter(item => {
    // Mencari di SEMUA kolom yang didefinisikan di 'columns'
    return columns.some(col => {
      const value = item[col.key] ? item[col.key].toString() : '';
      return value.toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  // 2. Logika Paginasi
  const totalItems = filteredPrestasi.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage)); 
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems); 
  const paginatedPrestasi = filteredPrestasi.slice(startIndex, endIndex);

  // === HANDLERS (Aksi Pengguna) ===

  /**
   * Menghapus data dari state LOKAL (dummy)
   */
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const res = await fetch(`/api/v1/forms/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Gagal menghapus data');
        setPrestasiList(prev => prev.filter(item => item.id !== id));
        alert('Data berhasil dihapus.');
      } catch (err) {
        alert('Gagal menghapus data dari server.');
      }
    }
  };

  /**
   * Format tanggal ke format Indonesia
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // === RENDER LOGIC ===
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Data Prestasi untuk SKPI
        </h1>
        <button
          onClick={() => navigate('/prestasi/create')} // Ganti dengan rute "create" Anda
          className="inline-flex items-center px-4 py-2 mt-4 sm:mt-0 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah
        </button>
      </div>

      {/* --- KONTEN TABEL (CARD PUTIH) --- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        
        {/* --- KONTROL ATAS (SEARCH & FILTER) --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Tampilkan</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); 
              }}
              className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>data</span>
          </div>
          
          <div className="flex items-center relative w-full sm:w-auto">
            <label htmlFor="search" className="mr-2 text-sm text-gray-700 shrink-0">Pencarian:</label>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="search"
                placeholder="Cari di semua kolom..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); 
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* --- TABEL UTAMA (DINAMIS) --- */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Memuat data...</div>
          ) : (
          <table className="min-w-full divide-y divide-gray-200">
            {/* === 3. HEADER TABEL DINAMIS === */}
            <thead className="bg-gray-50">
              <tr>
                {/* Kolom "No" tetap statis */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                
                {/* Loop dari array 'columns' */}
                {columns.map((col) => (
                  <th 
                    key={col.key} 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}

                {/* Kolom "Aksi" tetap statis */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            
            {/* === 4. BODY TABEL DINAMIS === */}
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPrestasi.length === 0 ? (
                <tr>
                  {/* colspan dinamis: jumlah kolom + 'No' + 'Aksi' */}
                  <td colSpan={columns.length + 2} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? 'Tidak ada data yang cocok dengan pencarian Anda.' : 'Tidak ada data yang tersedia pada tabel ini'}
                  </td>
                </tr>
              ) : (
                paginatedPrestasi.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Sel "No" statis */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startIndex + index + 1} 
                    </td>
                    
                    {/* Loop dari array 'columns' untuk setiap baris data */}
                    {columns.map((col) => {
                      const value = item[col.key]; // Mengambil nilai, misal: item['nama_prestasi']
                      
                      return (
                        <td 
                          key={col.key} 
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            // Styling khusus untuk kolom pertama
                            col.key === 'nama_prestasi' 
                              ? 'text-gray-900 font-medium' 
                              : 'text-gray-500'
                          }`}
                        >
                          {/* Styling khusus untuk tanggal */}
                          {col.key === 'tanggal' ? formatDate(value) : (value || '-')}
                        </td>
                      );
                    })}

                    {/* Sel "Aksi" statis */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => navigate(`/prestasi/edit/${item.id}`)} 
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="text-red-600 hover:text-red-900"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
              )}
        </div>

        {/* --- FOOTER PAGINASI --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-t border-gray-200 text-sm text-gray-700">
          <div>
            Menampilkan 
            <span className="font-medium"> {totalItems > 0 ? startIndex + 1 : 0} </span> 
            sampai 
            <span className="font-medium"> {endIndex} </span> 
            dari 
            <span className="font-medium"> {totalItems} </span> 
            data
          </div>
          
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="px-2 text-sm">
              Halaman {currentPage} dari {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TablePage;