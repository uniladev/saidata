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
                'type' => 'category',
                'submenu' => [
                    [
                        'id' => 21, 
                        'name' => 'Layanan Akademik', 
                        'path' => '/dashboard/university/academic', 
                        'order' => 1,
                        'type' => 'subcategory',
                        'icon' => 'BookOpen',
                        'roles' => ['admin'],
                        'submenu' => [
                            [
                                'id' => 211,
                                'name' => 'Pendaftaran Mahasiswa',
                                'path' => '/dashboard/university/academic/enrollment',
                                'order' => 1,
                                'type' => 'subcategory',
                                'icon' => 'UserPlus',
                                'roles' => ['admin'],
                                'submenu' => [
                                    [
                                        'id' => 2111,
                                        'name' => 'Mahasiswa Baru',
                                        'path' => '/dashboard/university/academic/enrollment/new',
                                        'order' => 1,
                                        'type' => 'subcategory',
                                        'icon' => 'Users',
                                        'roles' => ['admin'],
                                        'submenu' => [
                                            [
                                                'id' => 21111,
                                                'name' => 'Formulir Pendaftaran',
                                                'path' => '/dashboard/university/academic/enrollment/new/form',
                                                'order' => 1,
                                                'type' => 'service',
                                                'roles' => ['admin'],
                                                'formId' => 1,
                                                'outputConfig' => 'Generate PDF pendaftaran mahasiswa baru'
                                            ],
                                            [
                                                'id' => 21112,
                                                'name' => 'Verifikasi Dokumen',
                                                'path' => '/dashboard/university/academic/enrollment/new/verify',
                                                'order' => 2,
                                                'type' => 'service',
                                                'roles' => ['admin'],
                                                'formId' => 2,
                                                'outputConfig' => 'Generate surat verifikasi dokumen'
                                            ]
                                        ]
                                    ],
                                    [
                                        'id' => 2112,
                                        'name' => 'Transfer Mahasiswa',
                                        'path' => '/dashboard/university/academic/enrollment/transfer',
                                        'order' => 2,
                                        'type' => 'service',
                                        'roles' => ['admin'],
                                        'formId' => 3,
                                        'outputConfig' => 'Generate surat keterangan transfer'
                                    ]
                                ]
                            ],
                            [
                                'id' => 212,
                                'name' => 'Manajemen Kurikulum',
                                'path' => '/dashboard/university/academic/curriculum',
                                'order' => 2,
                                'type' => 'service',
                                'roles' => ['admin'],
                                'formId' => 4,
                                'outputConfig' => 'Generate laporan kurikulum'
                            ]
                        ]
                    ],
                    [
                        'id' => 22, 
                        'name' => 'Layanan Keuangan', 
                        'path' => '/dashboard/university/finance', 
                        'order' => 2,
                        'type' => 'subcategory',
                        'icon' => 'DollarSign',
                        'roles' => ['admin'],
                        'submenu' => [
                            [
                                'id' => 221,
                                'name' => 'Pembayaran SPP',
                                'path' => '/dashboard/university/finance/tuition',
                                'order' => 1,
                                'type' => 'service',
                                'roles' => ['admin'],
                                'formId' => 5,
                                'outputConfig' => 'Generate kwitansi pembayaran SPP'
                            ],
                            [
                                'id' => 222,
                                'name' => 'Beasiswa',
                                'path' => '/dashboard/university/finance/scholarship',
                                'order' => 2,
                                'type' => 'service',
                                'roles' => ['admin'],
                                'formId' => 6,
                                'outputConfig' => 'Generate surat keterangan beasiswa'
                            ]
                        ]
                    ],
                    [
                        'id' => 23, 
                        'name' => 'Layanan Umum', 
                        'path' => '/dashboard/university/general', 
                        'order' => 3,
                        'type' => 'service',
                        'roles' => ['admin'],
                        'formId' => 7,
                        'outputConfig' => 'Generate surat keterangan umum'
                    ]
                ]
            ],
            [
                'id' => 3,
                'name' => 'Layanan Fakultas',
                'icon' => 'GraduationCap',
                'order' => 3,
                'roles' => ['admin'],
                'type' => 'category',
                'submenu' => [
                    [
                        'id' => 31, 
                        'name' => 'Layanan Umum', 
                        'path' => '/dashboard/faculty/general', 
                        'order' => 1,
                        'type' => 'subcategory',
                        'icon' => 'FileText',
                        'roles' => ['admin'],
                        'submenu' => [
                            [
                                'id' => 311,
                                'name' => 'Surat Keterangan',
                                'path' => '/dashboard/faculty/general/certificate',
                                'order' => 1,
                                'type' => 'subcategory',
                                'icon' => 'Award',
                                'roles' => ['admin'],
                                'submenu' => [
                                    [
                                        'id' => 3111,
                                        'name' => 'Surat Aktif Kuliah',
                                        'path' => '/dashboard/faculty/general/certificate/active',
                                        'order' => 1,
                                        'type' => 'service',
                                        'roles' => ['admin'],
                                        'formId' => 8,
                                        'outputConfig' => 'Generate surat keterangan aktif kuliah'
                                    ],
                                    [
                                        'id' => 3112,
                                        'name' => 'Surat Keterangan Lulus',
                                        'path' => '/dashboard/faculty/general/certificate/graduation',
                                        'order' => 2,
                                        'type' => 'service',
                                        'roles' => ['admin'],
                                        'formId' => 9,
                                        'outputConfig' => 'Generate surat keterangan lulus'
                                    ]
                                ]
                            ],
                            [
                                'id' => 312,
                                'name' => 'Legalisir Dokumen',
                                'path' => '/dashboard/faculty/general/legalization',
                                'order' => 2,
                                'type' => 'service',
                                'roles' => ['admin'],
                                'formId' => 10,
                                'outputConfig' => 'Generate tanda terima legalisir'
                            ]
                        ]
                    ],
                    [
                        'id' => 32, 
                        'name' => 'Layanan Akademik', 
                        'path' => '/dashboard/faculty/academic', 
                        'order' => 2,
                        'type' => 'subcategory',
                        'icon' => 'BookOpen',
                        'roles' => ['admin'],
                        'submenu' => [
                            [
                                'id' => 321,
                                'name' => 'Perwalian',
                                'path' => '/dashboard/faculty/academic/advisory',
                                'order' => 1,
                                'type' => 'service',
                                'roles' => ['admin'],
                                'formId' => 11,
                                'outputConfig' => 'Generate laporan perwalian'
                            ],
                            [
                                'id' => 322,
                                'name' => 'Ujian Proposal',
                                'path' => '/dashboard/faculty/academic/proposal',
                                'order' => 2,
                                'type' => 'service',
                                'roles' => ['admin'],
                                'formId' => 12,
                                'outputConfig' => 'Generate form pendaftaran ujian proposal'
                            ]
                        ]
                    ],
                    [
                        'id' => 33, 
                        'name' => 'Layanan Keuangan', 
                        'path' => '/dashboard/faculty/finance', 
                        'order' => 3,
                        'type' => 'service',
                        'roles' => ['admin'],
                        'formId' => 13,
                        'outputConfig' => 'Generate laporan keuangan fakultas'
                    ]
                ]
            ],
            [
                'id' => 4,
                'name' => 'Layanan Jurusan',
                'icon' => 'Building2',
                'order' => 4,
                'roles' => ['admin'],
                'type' => 'category',
                'submenu' => [
                    [
                        'id' => 41, 
                        'name' => 'Layanan Akademik', 
                        'path' => '/dashboard/department/academic', 
                        'order' => 1,
                        'type' => 'subcategory',
                        'icon' => 'BookOpen',
                        'roles' => ['admin'],
                        'submenu' => [
                            [
                                'id' => 411,
                                'name' => 'Tugas Akhir',
                                'path' => '/dashboard/department/academic/thesis',
                                'order' => 1,
                                'type' => 'subcategory',
                                'icon' => 'GraduationCap',
                                'roles' => ['admin'],
                                'submenu' => [
                                    [
                                        'id' => 4111,
                                        'name' => 'Pendaftaran Tugas Akhir',
                                        'path' => '/dashboard/department/academic/thesis/registration',
                                        'order' => 1,
                                        'type' => 'service',
                                        'roles' => ['admin'],
                                        'formId' => 14,
                                        'outputConfig' => 'Generate form pendaftaran tugas akhir'
                                    ],
                                    [
                                        'id' => 4112,
                                        'name' => 'Seminar Proposal',
                                        'path' => '/dashboard/department/academic/thesis/seminar',
                                        'order' => 2,
                                        'type' => 'service',
                                        'roles' => ['admin'],
                                        'formId' => 15,
                                        'outputConfig' => 'Generate form pendaftaran seminar proposal'
                                    ]
                                ]
                            ],
                            [
                                'id' => 412,
                                'name' => 'Praktikum',
                                'path' => '/dashboard/department/academic/practicum',
                                'order' => 2,
                                'type' => 'service',
                                'roles' => ['admin'],
                                'formId' => 16,
                                'outputConfig' => 'Generate jadwal praktikum'
                            ]
                        ]
                    ],
                    [
                        'id' => 42, 
                        'name' => 'Layanan Laboratorium', 
                        'path' => '/dashboard/department/laboratory', 
                        'order' => 2,
                        'type' => 'subcategory',
                        'icon' => 'Microscope',
                        'roles' => ['admin'],
                        'submenu' => [
                            [
                                'id' => 421,
                                'name' => 'Peminjaman Alat',
                                'path' => '/dashboard/department/laboratory/equipment',
                                'order' => 1,
                                'type' => 'service',
                                'roles' => ['admin'],
                                'formId' => 17,
                                'outputConfig' => 'Generate form peminjaman alat lab'
                            ],
                            [
                                'id' => 422,
                                'name' => 'Reservasi Ruang Lab',
                                'path' => '/dashboard/department/laboratory/reservation',
                                'order' => 2,
                                'type' => 'service',
                                'roles' => ['admin'],
                                'formId' => 18,
                                'outputConfig' => 'Generate konfirmasi reservasi ruang lab'
                            ]
                        ]
                    ],
                    [
                        'id' => 43, 
                        'name' => 'Layanan IT & Server', 
                        'path' => '/dashboard/department/it-services', 
                        'order' => 3,
                        'type' => 'service',
                        'roles' => ['admin'],
                        'formId' => 19,
                        'outputConfig' => 'Generate laporan layanan IT'
                    ],
                    [
                        'id' => 44, 
                        'name' => 'Layanan Administrasi', 
                        'path' => '/dashboard/department/administration', 
                        'order' => 4,
                        'type' => 'service',
                        'roles' => ['admin'],
                        'formId' => 20,
                        'outputConfig' => 'Generate dokumen administrasi'
                    ],
                    [
                        'id' => 45, 
                        'name' => 'Layanan Penelitian', 
                        'path' => '/dashboard/department/research', 
                        'order' => 5,
                        'type' => 'service',
                        'roles' => ['admin'],
                        'formId' => 21,
                        'outputConfig' => 'Generate laporan penelitian'
                    ]
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

        // Get dynamic items from session and add them to the structure
        $dynamicItems = session('dynamic_menu_items', []);
        
        Log::info('📊 Backend: Session data check', [
            'dynamic_items_count' => count($dynamicItems),
            'dynamic_items' => $dynamicItems
        ]);
        
        $result = $staticData;
        
        foreach ($dynamicItems as $item) {
            Log::info('🔄 Backend: Processing dynamic item', ['item' => $item]);
            $result = $this->addItemToStructure($result, $item);
        }

        Log::info('📊 Backend: Final result after merging', [
            'static_items' => count($staticData),
            'dynamic_items' => count($dynamicItems),
            'total_categories' => count($result)
        ]);

        return $result;
    }

    /**
     * Helper method to add dynamic items to the menu structure
     */
    private function addItemToStructure($structure, $newItem)
    {
        Log::info('🔍 Backend: addItemToStructure called', [
            'newItem_id' => $newItem['id'],
            'newItem_name' => $newItem['name'],
            'newItem_type' => $newItem['type'],
            'newItem_categoryId' => $newItem['categoryId'] ?? 'null',
            'newItem_parentId' => $newItem['parentId'] ?? 'null'
        ]);

        // If it's a top-level category
        if (!isset($newItem['parentId']) || $newItem['parentId'] === null) {
            $structure[] = $newItem;
            Log::info('✅ Backend: Added as top-level category');
            return $structure;
        }

        // Find the parent and add the item
        foreach ($structure as &$category) {
            Log::info('🔍 Backend: Checking category', [
                'category_id' => $category['id'],
                'category_name' => $category['name']
            ]);

            if ($category['id'] == $newItem['categoryId']) {
                Log::info('✅ Backend: Found matching categoryId', ['category_id' => $category['id']]);
                
                // Add to category level
                if ($newItem['parentId'] == $category['id']) {
                    if (!isset($category['submenu'])) {
                        $category['submenu'] = [];
                    }
                    $category['submenu'][] = $newItem;
                    Log::info('✅ Backend: Added item to category level');
                    return $structure;
                }
                
                // Search in nested levels
                if (isset($category['submenu'])) {
                    Log::info('🔄 Backend: Searching in nested levels');
                    $category['submenu'] = $this->addToNestedStructure($category['submenu'], $newItem);
                }
                return $structure;
            }
        }
        
        Log::warning('⚠️ Backend: Parent not found for item', ['newItem' => $newItem]);
        return $structure;
    }

    /**
     * Helper method to add items to nested structure recursively
     */
    private function addToNestedStructure($submenu, $newItem)
    {
        Log::info('🔍 Backend: addToNestedStructure called', [
            'submenu_count' => count($submenu),
            'newItem_parentId' => $newItem['parentId']
        ]);

        foreach ($submenu as &$item) {
            Log::info('🔍 Backend: Checking submenu item', [
                'item_id' => $item['id'],
                'item_name' => $item['name'],
                'looking_for_parentId' => $newItem['parentId']
            ]);

            if ($item['id'] == $newItem['parentId']) {
                if (!isset($item['submenu'])) {
                    $item['submenu'] = [];
                }
                $item['submenu'][] = $newItem;
                Log::info('✅ Backend: Added item to nested level', [
                    'parent_id' => $item['id'],
                    'parent_name' => $item['name']
                ]);
                return $submenu;
            }
            
            if (isset($item['submenu'])) {
                Log::info('🔄 Backend: Going deeper into submenu');
                $item['submenu'] = $this->addToNestedStructure($item['submenu'], $newItem);
            }
        }
        
        Log::warning('⚠️ Backend: Parent not found in nested structure');
        return $submenu;
    }

/**
 * Store a newly created menu item
 */
public function store(Request $request)
{
    Log::info('🚀 Backend: MenuManagement store() method called');
    Log::info('📦 Backend: Request data received:', $request->all());

    $user = Auth::user();
    Log::info('👤 Backend: Authenticated user:', ['id' => $user?->id, 'role' => $user?->role]);
    
    if (!$user || $user->role !== 'admin') {
        Log::warning('MenuManagement Store: Unauthorized access attempt');
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'type' => 'required|in:category,subcategory,service',
        'parentId' => 'nullable|integer',
        'categoryId' => 'nullable|integer',
        'path' => 'nullable|string|max:255',
        'icon' => 'nullable|string|max:50',
        'order' => 'required|integer|min:1',
        'roles' => 'required|array',
        'roles.*' => 'string|in:admin,user',
        'formId' => 'nullable|integer',
        'outputConfig' => 'nullable|string'
    ]);

    try {
        $newId = time() + rand(1000, 9999);
        
        $menuItem = array_merge(['id' => $newId], $validated, [
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Store in session
        $dynamicItems = session('dynamic_menu_items', []);
        $dynamicItems[] = $menuItem;
        session(['dynamic_menu_items' => $dynamicItems]);

        Log::info('MenuManagement: New menu item created and stored in session', ['item' => $menuItem]);

        return response()->json([
            'success' => true,
            'message' => 'Menu item created successfully',
            'data' => $menuItem
        ], 201);

    } catch (\Exception $e) {
        Log::error('MenuManagement Store Error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to create menu item'
        ], 500);
    }
}

/**
 * Update the specified menu item
 */
public function update(Request $request, $id)
{
    $user = Auth::user();
    
    if (!$user || $user->role !== 'admin') {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }

    $validated = $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'path' => 'nullable|string|max:255',
        'icon' => 'nullable|string|max:50',
        'order' => 'sometimes|required|integer|min:1',
        'roles' => 'sometimes|required|array',
        'roles.*' => 'string|in:admin,user',
        'formId' => 'nullable|integer',
        'outputConfig' => 'nullable|string'
    ]);

    try {
        Log::info('MenuManagement: Menu item updated', ['id' => $id, 'data' => $validated]);

        return response()->json([
            'success' => true,
            'message' => 'Menu item updated successfully',
            'data' => array_merge(['id' => $id], $validated)
        ]);

    } catch (\Exception $e) {
        Log::error('MenuManagement Update Error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to update menu item'
        ], 500);
    }
}

/**
 * Remove the specified menu item
 */
public function destroy($id)
{
    $user = Auth::user();
    
    if (!$user || $user->role !== 'admin') {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }

    try {
        Log::info('MenuManagement: Menu item deleted', ['id' => $id]);

        return response()->json([
            'success' => true,
            'message' => 'Menu item deleted successfully'
        ]);

    } catch (\Exception $e) {
        Log::error('MenuManagement Delete Error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to delete menu item'
        ], 500);
    }
}

/**
 * Reorder menu items
 */
public function reorder(Request $request)
{
    $user = Auth::user();
    
    if (!$user || $user->role !== 'admin') {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }

    $validated = $request->validate([
        'items' => 'required|array',
        'items.*.id' => 'required|integer',
        'items.*.order' => 'required|integer|min:1'
    ]);

    try {
        foreach ($validated['items'] as $item) {
            Log::info('MenuManagement: Reordering item', [
                'id' => $item['id'], 
                'new_order' => $item['order']
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Menu items reordered successfully'
        ]);

    } catch (\Exception $e) {
        Log::error('MenuManagement Reorder Error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to reorder menu items'
        ], 500);
    }
}

/**
 * Reorder nested menu items
 */
public function reorderNested(Request $request)
{
    $user = Auth::user();
    
    if (!$user || $user->role !== 'admin') {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }

    try {
        $structure = $request->input('structure', []);
        Log::info('MenuManagement: Nested structure reordered', ['structure_count' => count($structure)]);

        return response()->json([
            'success' => true,
            'message' => 'Nested menu items reordered successfully'
        ]);

    } catch (\Exception $e) {
        Log::error('MenuManagement Reorder Nested Error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to reorder nested menu items'
        ], 500);
    }
}
}