<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // <-- TAMBAHKAN BARIS INI
use Illuminate\Support\Facades\Auth;

/**
 * Controller ini khusus untuk halaman Menu Management.
 * Controller ini mengembalikan data menu yang SUDAH DIFILTER
 * berdasarkan role admin.
 */
class MenuManagementController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/v1/menu-management",
     * tags={"Menu Management"},
     * summary="Get dynamic menu for Management Page, filtered by admin role",
     * description="Mengambil data menu dinamis untuk halaman manajemen, sudah difilter berdasarkan role/nama admin.",
     * operationId="getDynamicManagementMenu",
     * security={{"bearerAuth":{}}},
     *
     * @OA\Response(
     * response=200,
     * description="Berhasil mengambil data menu yang difilter",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="data", type="object", @OA\Property(property="menu", type="array", @OA\Items(type="object")))
     * )
     * ),
     * @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            Log::warning('MenuManagement: Request gagal, user unauthenticated.'); // <-- LOG
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        if ($user->role !== 'admin') {
            Log::warning('MenuManagement: Request gagal, user bukan admin.'); // <-- LOG
             return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
                'data' => ['menu' => []]
            ], 403);
        }

        // 1. Dapatkan nama admin untuk filter
        Log::debug('============================================');
        Log::debug('MenuManagement: Memulai request...');

        // Ambil data profile dengan aman (seperti di MenuController.php)
        $profile = $user->profile ?? [];
        if (is_object($profile)) {
            $profile = (array) $profile;
        }

        // Ambil nama dari DALAM profile, BUKAN dari user root
        $adminName = $profile['name'] ?? null; // <-- INI SOLUSINYA

        // Log yang sudah aman dan benar
        Log::debug("MenuManagement: User terdeteksi: " . $adminName);

        // 2. Ambil data menu mentah lengkap (Base + Admin + Common)
        // Ini adalah sumber data lengkap sebelum difilter
        $allAdminMenus = $this->getCompleteAdminDataset();
        Log::debug("MenuManagement: Total item mentah didapat: " . count($allAdminMenus)); // <-- LOG

        // 3. Terapkan filter backend BARU berdasarkan permintaan spesifik
        $filteredMenu = [];
        switch ($adminName) {
            case 'Administrator':
                Log::debug("MenuManagement: Masuk case 'Administrator'"); // <-- LOG
                // Super Admin: dapat semua menu
                $filteredMenu = $allAdminMenus;
                break;
            
            case 'Administrator Univ':
                Log::debug("MenuManagement: Masuk case 'Administrator Univ'"); // <-- LOG
                // HANYA 'Layanan Universitas' + item baru 'Update Data'
                $filteredMenu = array_filter($allAdminMenus, function($menu) {
                    return $menu['name'] === 'Layanan Universitas';
                });
                
                // Tambahkan item baru 'Update Data' secara manual
                $filteredMenu[] = [
                    'id' => 9999, // ID dummy unik
                    'name' => 'Update Data',
                    'icon' => 'UploadCloud', // Icon contoh
                    'path' => '/dashboard/update-data', // Path contoh
                    'order' => 5, // Urutan (setelah Layanan Univ)
                    'roles' => ['admin']
                ];
                break;

            case 'Administrator Fakultas':
                Log::debug("MenuManagement: Masuk case 'Administrator Fakultas'"); // <-- LOG
                // HANYA 'Layanan Fakultas'
                $filteredMenu = array_filter($allAdminMenus, function($menu) {
                    return $menu['name'] === 'Layanan Fakultas';
                });
                break;
            
            case 'Administrator Jurusan':
                Log::debug("MenuManagement: Masuk case 'Administrator Jurusan'"); // <-- LOG
                // HANYA 'Layanan Jurusan'
                $filteredMenu = array_filter($allAdminMenus, function($menu) {
                    return $menu['name'] === 'Layanan Jurusan';
                });
                break;

            default:
            Log::debug("MenuManagement: Masuk case 'default' (admin tidak dikenal)"); // <-- LOG
                // Admin tidak dikenal, kembalikan array kosong
                $filteredMenu = []; 
                break;
        }

        Log::debug("MenuManagement: Jumlah item setelah filter: " . count($filteredMenu)); // <-- LOG

        // 4. Ubah hasil filter kembali menjadi array (bukan object)
        $finalMenu = array_values($filteredMenu);

        // Sort by order
        usort($finalMenu, function($a, $b) {
            return $a['order'] <=> $b['order'];
        });

        // 5. Ambil data user info (hanya untuk konsistensi)
        $profile = $user->profile ?? [];
        if (is_object($profile)) {
            $profile = (array) $profile;
        }
        $facultyCode = $profile['faculty_code'] ?? null;
        $departmentCode = $profile['department_code'] ?? null;
        $studyProgramCode = $profile['study_program_code'] ?? null;

        // 6. Kembalikan data yang SUDAH DIFILTER
        Log::debug("MenuManagement: Mengirim " . count($finalMenu) . " item ke frontend."); // <-- LOG
        Log::debug('============================================'); // <-- LOG
        return response()->json([
            'success' => true,
            'data' => [
                'menu' => $finalMenu,
                'user_info' => [
                    'faculty' => $facultyCode,
                    'faculty_code' => $facultyCode,
                    'department' => $departmentCode,
                    'department_code' => $departmentCode,
                    'study_program' => $studyProgramCode,
                    'study_program_code' => $studyProgramCode,
                ]
            ]
        ]);
    }

    /**
     * Fungsi helper BARU untuk menggabungkan semua dataset admin
     * dari file MenuController.php yang asli
     */
    private function getCompleteAdminDataset()
    {
        // 1. Base menu items (dari index() asli)
        $baseMenu = [
            [
                'id' => 1,
                'name' => 'Dashboard',
                'icon' => 'LayoutDashboard',
                'path' => '/dashboard',
                'order' => 1,
                'roles' => ['admin', 'user']
            ],
            [
            'id' => 90909,
                'name' => 'DEVTEST (EDIT DI  BACKEND MENU CONTROLLER)',
                'icon' => 'ClipboardList',
                'order' => 2,
                'roles' => ['admin', 'user'],
                'submenu' => [
                    ['id' => 2001, 'name' => 'Create Form', 'path' => '/forms/create', 'order' => 1],
                    ['id' => 2002, 'name' => 'Form List', 'path' => '/forms', 'order' => 2],
                    ['id' => 2003, 'name' => 'Menu Setting', 'path' => '/menu', 'order' => 3],
                ]
            ],
        ];

        // 2. Admin menu items (dari getAdminMenu() asli)
        $adminMenu = $this->getAdminMenu();

        // 3. Common menu items (dari index() asli)
        $commonMenu = [
            [
                'id' => 100,
                'name' => 'Riwayat Permohonan',
                'icon' => 'ClipboardList',
                'order' => 100,
                'roles' => ['admin', 'user'],
                'submenu' => [
                    ['id' => 1001, 'name' => 'Semua Permohonan', 'path' => '/dashboard/requests', 'order' => 1],
                    ['id' => 1002, 'name' => 'Permohonan Pending', 'path' => '/dashboard/requests/pending', 'order' => 2],
                    ['id' => 1003, 'name' => 'Permohonan Disetujui', 'path' => '/dashboard/requests/approved', 'order' => 3],
                    ['id' => 1004, 'name' => 'Permohonan Ditolak', 'path' => '/dashboard/requests/rejected', 'order' => 4],
                ]
            ],
            [
                'id' => 101,
                'name' => 'Pengaturan',
                'icon' => 'Settings',
                'path' => '/dashboard/settings',
                'order' => 101,
                'roles' => ['admin', 'user']
            ],
            [
                'id' => 102,
                'name' => 'Bantuan',
                'icon' => 'HelpCircle',
                'path' => '/dashboard/help',
                'order' => 102,
                'roles' => ['admin', 'user']
            ]
        ];

        // Gabungkan semua menjadi satu array mentah
        return array_merge($baseMenu, $adminMenu, $commonMenu);
    }

    /*
    |--------------------------------------------------------------------------
    | FUNGSI-FUNGSI YANG DISALIN
    |--------------------------------------------------------------------------
    |
    | Semua fungsi privat di bawah ini disalin langsung dari MenuController.php
    | untuk memastikan getAdminMenu() berfungsi dengan baik.
    |
    */

    /**
     * Get menu for regular users (mahasiswa)
     * (Disalin - tidak digunakan oleh index() di file ini, tapi ada untuk kelengkapan)
     */
    private function getUserMenu($facultyCode, $departmentCode, $studyProgramCode)
    {
        $menu = [];
        $menu[] = [
            'id' => 2, 'name' => 'Layanan Universitas', 'icon' => 'Building', 'order' => 2, 'roles' => ['user'],
            'submenu' => [ /* ... */ ]
        ];
        if ($facultyCode) {
            $menu[] = [
                'id' => 3, 'name' => 'Layanan Fakultas', 'icon' => 'GraduationCap', 'order' => 3, 'roles' => ['user'],
                'submenu' => $this->getFacultySubmenu($facultyCode)
            ];
        }
        if ($departmentCode) {
            $menu[] = [
                'id' => 4, 'name' => 'Layanan Jurusan', 'icon' => 'BookOpen', 'order' => 4, 'roles' => ['user'],
                'submenu' => $this->getDepartmentSubmenu($facultyCode, $departmentCode)
            ];
        }
        return $menu;
    }
    
    /**
     * Get submenu for faculty
     * (Disalin)
     */
    private function getFacultySubmenu($facultyCode)
    {
        // Submenu berbeda per fakultas
        switch ($facultyCode) {
            case 'FMIPA':
                return [
                    ['id' => 31, 'name' => 'Layanan Umum', 'path' => '/dashboard/faculty/general', 'order' => 1],
                    ['id' => 32, 'name' => 'Layanan Akademik', 'path' => '/dashboard/faculty/academic', 'order' => 2],
                    ['id' => 33, 'name' => 'Layanan Penelitian', 'path' => '/dashboard/faculty/research', 'order' => 3],
                    ['id' => 34, 'name' => 'Layanan Laboratorium', 'path' => '/dashboard/faculty/laboratory', 'order' => 4],
                ];
            // ... (case lain disalin dari file asli)
            default:
                return [
                    ['id' => 31, 'name' => 'Layanan Umum', 'path' => '/dashboard/faculty/general', 'order' => 1],
                    ['id' => 32, 'name' => 'Layanan Akademik', 'path' => '/dashboard/faculty/academic', 'order' => 2],
                ];
        }
    }

    /**
     * Get submenu for department
     * (Disalin)
     */
    private function getDepartmentSubmenu($facultyCode, $departmentCode)
    {
        // Submenu berbeda per jurusan
        $key = "{$facultyCode}_{$departmentCode}";
        switch ($key) {
            // FMIPA - Ilmu Komputer
            case 'FMIPA_ILKOM':
                return [
                    ['id' => 41, 'name' => 'Layanan Akademik', 'path' => '/dashboard/department/academic', 'order' => 1],
                    ['id' => 42, 'name' => 'Lab Programming', 'path' => '/dashboard/department/programming-lab', 'order' => 2],
                    ['id' => 43, 'name' => 'Lab Jaringan', 'path' => '/dashboard/department/network-lab', 'order' => 3],
                    ['id' => 44, 'name' => 'Layanan Server & IT', 'path' => '/dashboard/department/it-services', 'order' => 4],
                    ['id' => 45, 'name' => 'Bimbingan Tugas Akhir', 'path' => '/dashboard/department/thesis-guidance', 'order' => 5],
                ];
            // ... (case lain disalin dari file asli)
            default:
                return [
                    ['id' => 41, 'name' => 'Layanan Akademik', 'path' => '/dashboard/department/academic', 'order' => 1],
                    ['id' => 42, 'name' => 'Layanan Administrasi', 'path' => '/dashboard/department/administration', 'order' => 2],
                ];
        }
    }

    /**
     * Get department display name
     * (Disalin)
     */
    private function getDepartmentDisplayName($departmentCode)
    {
        // ... (disalin dari file asli)
    }

    /**
     * Get menu for admin users
     * (Disalin - ini adalah data mentah yang kita filter)
     */
    private function getAdminMenu()
    {
        // --- INI ADALAH KODE YANG SUDAH DIPERBAIKI ---
        return [
            [
                'id' => 2,
                'name' => 'Layanan Universitas',
                'icon' => 'Building',
                'order' => 2,
                'roles' => ['admin'],
                'submenu' => [
                    ['id' => 21, 'name' => 'Layanan Akademik', 'path' => '/dashboard/university/academic', 'order' => 1],
                    ['id' => 22, 'name' => 'Layanan Keuangan', 'path' => '/dashboard/university/finance', 'order' => 2],
                    ['id' => 23, 'name' => 'Layanan Umum', 'path' => '/dashboard/university/general', 'order' => 3],
                ]
            ],
            [
                'id' => 3,
                'name' => 'Layanan Fakultas',
                'icon' => 'GraduationCap',
                'order' => 3,
                'roles' => ['admin'],
                'submenu' => [
                    ['id' => 31, 'name' => 'Layanan Umum', 'path' => '/dashboard/faculty/general', 'order' => 1],
                    ['id' => 32, 'name' => 'Layanan Akademik', 'path' => '/dashboard/faculty/academic', 'order' => 2],
                    ['id' => 33, 'name' => 'Layanan Keuangan', 'path' => '/dashboard/faculty/finance', 'order' => 3],
                ]
            ],
            [
                'id' => 4,
                'name' => 'Layanan Jurusan',
                'icon' => 'Building2',
                'order' => 4,
                'roles' => ['admin'],
                'submenu' => [
                    ['id' => 41, 'name' => 'Layanan Akademik', 'path' => '/dashboard/department/academic', 'order' => 1],
                    ['id' => 42, 'name' => 'Layanan Laboratorium', 'path' => '/dashboard/department/laboratory', 'order' => 2],
                    ['id' => 43, 'name' => 'Layanan IT & Server', 'path' => '/dashboard/department/it-services', 'order' => 3],
                    ['id' => 44, 'name' => 'Layanan Administrasi', 'path' => '/dashboard/department/administration', 'order' => 4],
                    ['id' => 45, 'name' => 'Layanan Penelitian', 'path' => '/dashboard/department/research', 'order' => 5],
                ]
            ],
            [
                'id' => 6,
                'name' => 'Validasi Permohonan',
                'icon' => 'CheckCircle',
                'path' => '/dashboard/validation',
                'order' => 6,
                'roles' => ['admin']
            ],
            [
                'id' => 7,
                'name' => 'Users',
                'icon' => 'Users',
                'path' => '/dashboard/users',
                'order' => 7,
                'roles' => ['admin']
            ],
            [
                'id' => 8,
                'name' => 'Reports',
                'icon' => 'BarChart',
                'path' => '/dashboard/reports',
                'order' => 8,
                'roles' => ['admin']
            ],
        ];
    }
}