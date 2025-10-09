import { Link, useLocation } from "react-router-dom";
import { PrimaryButton, SecondaryButton } from "../components/ui/Button";

export default function NotFound() {
  const { pathname, search } = useLocation();
  const tried = `${pathname}${search}`;

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-600">404</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Halaman tidak ditemukan
          </h1>
          <p className="text-gray-600">
            Kami tidak menemukan halaman <span className="font-mono">{tried}</span>.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <PrimaryButton>
              Kembali ke Beranda
            </PrimaryButton>
          </Link>
          <SecondaryButton onClick={() => window.history.back()}>
            Kembali
          </SecondaryButton>
        </div>

        <p className="text-xs text-gray-500">
          Jika ini seharusnya ada, pastikan URL benar atau hubungi admin.
        </p>
      </div>
    </main>
  );
}
