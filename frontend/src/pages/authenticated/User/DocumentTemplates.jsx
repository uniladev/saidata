import React from 'react';
import { FileText } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function DocumentTemplates() {
    const { slug } = useParams();
     console.log('Current slug:', slug);
    // Dummy data for document templates
    const documentTemplates = [
        {
            id: 1,
            title: 'Borang Surat Mahasiswa Pengambilan 6 SKS'
        },
        {
            id: 2,
            title: 'Borang Surat Mahasiswa Pengunduran Diri'
        },
        {
            id: 3,
            title: 'Borang Surat Mahasiswa Cuti Akademik'
        },
        {
            id: 4,
            title: 'Borang Surat Mahasiswa Penghapusan Mata Kuliah'
        },
        {
            id: 5,
            title: 'Borang Surat Mahasiswa Perpanjangan Masa Studi'
        },
        {
            id: 6,
            title: 'Borang Surat Mahasiswa Perbaikan-Penggantian Ijazah-Transkrip'
        },
        {
            id: 7,
            title: 'Borang Surat Mahasiswa Studi Terbimbing'
        },
        {
            id: 8,
            title: 'Borang Bukti Penyerahan Tugas Akhir (Sebar)'
        },
        {
            id: 9,
            title: 'Borang Surat Akademik Lainnya'
        }
    ];

    const handleGenerateDocument = (templateId) => {
        console.log(`Generating document from template ${templateId}`);
        // Add your navigation or modal logic here
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                    {slug.charAt(0).toUpperCase() + slug.slice(1)}
                    </h1>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentTemplates.map((template) => {
                    return (
                        <div
                            key={template.id}
                            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                        >
                            {/* Icon */}
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 rounded-lg bg-indigo-500">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            {/* Template Info */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                                {template.title}
                            </h3>

                            {/* Action Button */}
                            <button
                                onClick={() => handleGenerateDocument(template.id)}
                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Buat
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {documentTemplates.length === 0 && (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Tidak ada template tersedia
                    </h3>
                    <p className="text-gray-500">
                        Template dokumen akan muncul di sini
                    </p>
                </div>
            )}
        </div>
    );
}