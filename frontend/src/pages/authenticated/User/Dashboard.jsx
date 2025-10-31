import { useMemo, useState } from "react";
import {
  User,
  HelpCircle,
  Download,
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  XCircle,
  Send,
  ShieldCheck,
  FilePlus2,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * SAIDATA FMIPA UNILA — USER DASHBOARD (Refined UX, Dummy)
 * --------------------------------------------------------
 * Order:
 * 1) Telegram Connect CTA
 * 2) Quick Actions (4 utama)
 * 3) Service History (tabel + search)
 * 4) Pengumuman & Tips
 * 5) Stat Cards kecil di bawah
 */

// ===== Dummy Data =====
const DUMMY_HISTORY = [
  {
    id: "REQ-241031-0001",
    created_at: "2025-10-31T12:45:00+07:00",
    service_name: "Surat Keterangan Aktif Kuliah",
    status: "approved",
    reference_no: "SKAK/UNILA/FMIPA/2025/1031/001",
    download_url: "#",
  },
  {
    id: "REQ-241030-0007",
    created_at: "2025-10-30T10:18:00+07:00",
    service_name: "Surat Pengantar Penelitian",
    status: "processing",
    reference_no: null,
    download_url: null,
  },
  {
    id: "REQ-241029-0003",
    created_at: "2025-10-29T09:05:00+07:00",
    service_name: "Surat Observasi Laboratorium",
    status: "rejected",
    reference_no: null,
    download_url: null,
  },
  {
    id: "REQ-241028-0010",
    created_at: "2025-10-28T16:20:00+07:00",
    service_name: "Surat Rekomendasi Kegiatan",
    status: "approved",
    reference_no: "SRK/UNILA/FMIPA/2025/1028/010",
    download_url: "#",
  },
];

const DUMMY_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Batas Pengajuan SKAK Periode Oktober",
    content:
      "Pengajuan SKAK untuk periode Oktober ditutup 15 November 2025 pukul 23:59 WIB.",
    date: "2025-10-31",
  },
  {
    id: 2,
    title: "Lampiran Wajib untuk Penelitian",
    content:
      "Pastikan melampirkan KRS/KHS terbaru dan proposal singkat (PDF) saat mengajukan surat penelitian.",
    date: "2025-10-27",
  },
];

const DUMMY_TIPS = [
  {
    id: 1,
    title: "Gunakan email Unila aktif",
    desc: "Notifikasi status dan file surat akan dikirim ke email student.unila.ac.id kamu.",
  },
  {
    id: 2,
    title: "Siapkan berkas PDF",
    desc: "Beberapa layanan memerlukan lampiran PDF (maks 2MB). Pastikan terbaca jelas.",
  },
  {
    id: 3,
    title: "Cek riwayat secara berkala",
    desc: "Status akan berubah otomatis saat diverifikasi loket fakultas.",
  },
];

const TELEGRAM = {
  BOT_USERNAME: "saidata_fmipa_bot",
  START_CODE: "DEMO-START-CODE",
};

// ===== Small UI Helpers =====
function StatCard({ icon: Icon, label, value, tone = "blue" }) {
  const toneClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    yellow: "bg-yellow-500",
    red: "bg-red-600",
  };
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-3 text-white ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center hover:border-blue-400 hover:bg-blue-50/40"
    >
      <Icon className="h-7 w-7" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

function StatusBadge({ status }) {
  const map = {
    approved: { text: "Disetujui", cls: "bg-green-100 text-green-700" },
    processing: { text: "Diproses", cls: "bg-yellow-100 text-yellow-800" },
    rejected: { text: "Ditolak", cls: "bg-red-100 text-red-700" },
  };
  const s = map[status] || { text: status, cls: "bg-gray-100 text-gray-700" };
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${s.cls}`}>{s.text}</span>;
}

function TablePager({ page, total, perPage, onPageChange }) {
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" /> Prev
      </button>
      <p className="text-sm text-gray-600">
        Page <span className="font-medium">{page}</span> of {lastPage}
      </p>
      <button
        onClick={() => onPageChange(Math.min(lastPage, page + 1))}
        disabled={page >= lastPage}
        className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm disabled:opacity-50"
      >
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [tgConnected, setTgConnected] = useState(false);
  const perPage = 5;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? DUMMY_HISTORY.filter(
          (r) =>
            r.service_name.toLowerCase().includes(q) ||
            r.id.toLowerCase().includes(q) ||
            (r.reference_no || "").toLowerCase().includes(q) ||
            r.status.toLowerCase().includes(q)
        )
      : DUMMY_HISTORY;
    return base;
  }, [query]);

  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const stats = useMemo(() => {
    const total = DUMMY_HISTORY.length;
    const approved = DUMMY_HISTORY.filter((d) => d.status === "approved").length;
    const processing = DUMMY_HISTORY.filter((d) => d.status === "processing").length;
    const rejected = DUMMY_HISTORY.filter((d) => d.status === "rejected").length;
    return { total, approved, processing, rejected };
  }, []);

  function onExportCSV() {
    const header = ["ID", "Tanggal", "Layanan", "Status", "Nomor Referensi"].join(",");
    const lines = DUMMY_HISTORY.map((r) =>
      [
        r.id,
        new Date(r.created_at).toLocaleString(),
        r.service_name,
        r.status,
        r.reference_no || "-",
      ]
        .map((x) => `"${String(x).replaceAll('"', '""')}"`)
        .join(",")
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `service-history-demo.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  const tgLink = `https://t.me/${TELEGRAM.BOT_USERNAME}?start=${encodeURIComponent(TELEGRAM.START_CODE)}`;

  return (
    <div className="space-y-6">
      {/* Telegram CTA */}
      <div className="rounded-2xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-semibold text-blue-700">Notifikasi Telegram</p>
            </div>
            <p className="mt-1 text-sm text-blue-900/80">
              Sambungkan akun kamu dengan bot Telegram untuk menerima notifikasi status pengajuan
              (disetujui/ditolak/diproses) secara real-time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!tgConnected ? (
              <a
                href={tgLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Send className="h-4 w-4" /> Hubungkan Bot
              </a>
            ) : (
              <button
                onClick={() => setTgConnected(false)}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-blue-700 hover:bg-blue-50"
              >
                Terhubung · Putuskan
              </button>
            )}
            <button
              onClick={onExportCSV}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-white/70"
            >
              <Download className="h-4 w-4" /> Export Riwayat
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Aksi Cepat</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <QuickAction to="/forms" icon={FilePlus2} label="Buat Pengajuan" />
          <QuickAction to="/templates" icon={FileText} label="Template Surat" />
          <QuickAction to="/profile" icon={User} label="Profil Saya" />
          <QuickAction to="/help" icon={HelpCircle} label="Panduan" />
        </div>
      </div>

      {/* Service History */}
      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between gap-3 border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">Riwayat Pengajuan</h2>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => {
                setPage(1);
                setQuery(e.target.value);
              }}
              placeholder="Cari layanan / status / nomor..."
              className="w-64 rounded-md border px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-600">Tanggal</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-600">Layanan</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-600">Status</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-600">Nomor Referensi</th>
                <th className="px-3 py-3.5 text-right text-xs font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paged.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-sm text-gray-900">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900">{r.service_name}</td>
                  <td className="px-3 py-4 text-sm"><StatusBadge status={r.status} /></td>
                  <td className="px-3 py-4 text-sm text-gray-900">{r.reference_no || "-"}</td>
                  <td className="px-3 py-4 text-right text-sm">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        to={`#/requests/${r.id}`}
                        className="rounded-md border px-2 py-1 text-gray-700 hover:bg-gray-50"
                      >
                        Detail
                      </Link>
                      {r.download_url ? (
                        <a
                          href={r.download_url}
                          className="rounded-md border px-2 py-1 text-blue-700 hover:bg-blue-50"
                        >
                          Unduh
                        </a>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-10 text-center text-sm text-gray-500">
                    Tidak ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t bg-gray-50 p-3">
          <p className="text-sm text-gray-600">
            Menampilkan <span className="font-medium">{paged.length}</span> dari {filtered.length} entri
          </p>
          <TablePager page={page} total={filtered.length} perPage={perPage} onPageChange={setPage} />
        </div>
      </div>

      {/* Announcements & Tips */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Pengumuman</h2>
          <div className="divide-y">
            {DUMMY_ANNOUNCEMENTS.map((a) => (
              <div key={a.id} className="py-3">
                <p className="text-sm text-gray-400">{a.date}</p>
                <p className="font-medium text-gray-900">{a.title}</p>
                <p className="text-sm text-gray-600">{a.content}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Tips</h2>
          <ul className="space-y-3">
            {DUMMY_TIPS.map((t) => (
              <li key={t.id} className="rounded-lg border p-3">
                <p className="text-sm font-medium text-gray-900">{t.title}</p>
                <p className="text-sm text-gray-600">{t.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tiny Stats at Bottom */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon={ShieldCheck} label="Total Pengajuan" value={stats.total} tone="blue" />
        <StatCard icon={CheckCircle2} label="Disetujui" value={stats.approved} tone="green" />
        <StatCard icon={Clock3} label="Diproses" value={stats.processing} tone="yellow" />
        <StatCard icon={XCircle} label="Ditolak" value={stats.rejected} tone="red" />
      </div>
    </div>
  );
}