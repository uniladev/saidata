import { Link, useLocation } from "react-router-dom";
import { PrimaryButton, SecondaryButton } from "../components/ui/Button";

export default function NotFound() {
  const { pathname, search } = useLocation();
  const tried = `${pathname}${search}`;

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-5xl w-full">
        {/* Hero Section - Maskot & 404 Bersebelahan */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-8">
          {/* Maskot - Kiri */}
          <div className="flex-shrink-0">
            <img 
              src="/images/maskot/notfound_maskot.webp" 
              alt="Maskot 404" 
              className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-contain"
              loading="lazy"
            />
          </div>

          {/* Tulisan 404 & Text - Kanan */}
          <div className="text-center lg:text-left space-y-3">
            <div className="space-y-2">
              {/* Angka 404 */}
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-blue-600 leading-none">
                404
              </h1>
              
              {/* Judul */}
              <h2 className="text-xl sm:text-3xl font-semibold text-gray-800">
                Halaman Tidak Ditemukan
              </h2>
              
              {/* Deskripsi */}
              <p className="text-base text-gray-600">
                Halaman yang Anda cari tidak ditemukan.
              </p>
              
              {/* URL yang dicoba */}
              <p className="text-sm text-gray-500">
                <span className="font-mono">{tried}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link to="/">
            <PrimaryButton className="w-full sm:w-auto min-w-[180px]">
              Kembali ke Beranda
            </PrimaryButton>
          </Link>
          <SecondaryButton onClick={() => window.history.back()} className="w-full sm:w-auto min-w-[180px]">
            Halaman Sebelumnya
          </SecondaryButton>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-gray-500 text-center">
          Periksa kembali URL atau hubungi admin jika masalah berlanjut.
        </p>
      </div>
    </main>
  );
}
