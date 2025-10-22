<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MenuController extends Controller
{
    /**
     * Get dynamic menu based on user's faculty and department
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Load user profile with relationships
        $profile = $user->profile;
        
        // Get faculty and department info
        $facultyCode = $profile?->faculty?->code;
        $departmentCode = $profile?->department?->code;
        $studyProgramCode = $profile?->study_program?->code;

        // Base menu items for all users
        $menuItems = [
            [
                'id' => 1,
                'name' => 'Dashboard',
                'icon' => 'LayoutDashboard',
                'path' => '/dashboard',
                'order' => 1,
                'roles' => ['admin', 'user']
            ],
        ];

        // Menu layanan berdasarkan role
        if ($user->role === 'user') {
            $menuItems = array_merge($menuItems, $this->getUserMenu($facultyCode, $departmentCode, $studyProgramCode));
        } elseif ($user->role === 'admin') {
            $menuItems = array_merge($menuItems, $this->getAdminMenu());
        }

        // Common menu items for all users
        $menuItems[] = [
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
        ];

        $menuItems[] = [
            'id' => 101,
            'name' => 'Pengaturan',
            'icon' => 'Settings',
            'path' => '/dashboard/settings',
            'order' => 101,
            'roles' => ['admin', 'user']
        ];

        $menuItems[] = [
            'id' => 102,
            'name' => 'Bantuan',
            'icon' => 'HelpCircle',
            'path' => '/dashboard/help',
            'order' => 102,
            'roles' => ['admin', 'user']
        ];

        // Sort by order
        usort($menuItems, function($a, $b) {
            return $a['order'] <=> $b['order'];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'menu' => $menuItems,
                'user_info' => [
                    'faculty' => $profile?->faculty?->name,
                    'faculty_code' => $facultyCode,
                    'department' => $profile?->department?->name,
                    'department_code' => $departmentCode,
                    'study_program' => $profile?->study_program?->name,
                    'study_program_code' => $studyProgramCode,
                ]
            ]
        ]);
    }

    /**
     * Get menu for regular users (mahasiswa)
     */
    private function getUserMenu($facultyCode, $departmentCode, $studyProgramCode)
    {
        $menu = [];

        // Menu Layanan Universitas (untuk semua mahasiswa)
        $menu[] = [
            'id' => 2,
            'name' => 'Layanan Universitas',
            'icon' => 'Building',
            'order' => 2,
            'roles' => ['user'],
            'submenu' => [
                ['id' => 21, 'name' => 'Layanan Akademik', 'path' => '/dashboard/university/academic', 'order' => 1],
                ['id' => 22, 'name' => 'Layanan Keuangan', 'path' => '/dashboard/university/finance', 'order' => 2],
                ['id' => 23, 'name' => 'Layanan Umum', 'path' => '/dashboard/university/general', 'order' => 3],
            ]
        ];

        // Menu Layanan Fakultas (custom per fakultas)
        if ($facultyCode) {
            $menu[] = [
                'id' => 3,
                'name' => 'Layanan Fakultas',
                'icon' => 'GraduationCap',
                'order' => 3,
                'roles' => ['user'],
                'submenu' => $this->getFacultySubmenu($facultyCode)
            ];
        }

        // Menu Layanan Jurusan (custom per jurusan)
        if ($departmentCode) {
            $menu[] = [
                'id' => 4,
                'name' => 'Layanan Jurusan',
                'icon' => 'BookOpen',
                'order' => 4,
                'roles' => ['user'],
                'submenu' => $this->getDepartmentSubmenu($facultyCode, $departmentCode)
            ];
        }

        return $menu;
    }

    /**
     * Get submenu for faculty
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
            
            case 'FK':
                return [
                    ['id' => 31, 'name' => 'Layanan Umum', 'path' => '/dashboard/faculty/general', 'order' => 1],
                    ['id' => 32, 'name' => 'Layanan Akademik', 'path' => '/dashboard/faculty/academic', 'order' => 2],
                    ['id' => 33, 'name' => 'Layanan Klinik', 'path' => '/dashboard/faculty/clinic', 'order' => 3],
                    ['id' => 34, 'name' => 'Layanan Praktek', 'path' => '/dashboard/faculty/practice', 'order' => 4],
                ];
            
            default:
                return [
                    ['id' => 31, 'name' => 'Layanan Umum', 'path' => '/dashboard/faculty/general', 'order' => 1],
                    ['id' => 32, 'name' => 'Layanan Akademik', 'path' => '/dashboard/faculty/academic', 'order' => 2],
                ];
        }
    }

    /**
     * Get submenu for department
     */
    private function getDepartmentSubmenu($facultyCode, $departmentCode)
    {
        // Submenu berbeda per jurusan
        $key = "{$facultyCode}_{$departmentCode}";
        
        switch ($key) {
            // FMIPA - Biologi
            case 'FMIPA_BIO':
                return [
                    ['id' => 41, 'name' => 'Layanan Akademik', 'path' => '/dashboard/department/academic', 'order' => 1],
                    ['id' => 42, 'name' => 'Layanan Lab Biologi', 'path' => '/dashboard/department/bio-lab', 'order' => 2],
                    ['id' => 43, 'name' => 'Penelitian Biologi', 'path' => '/dashboard/department/bio-research', 'order' => 3],
                    ['id' => 44, 'name' => 'Praktikum Lapangan', 'path' => '/dashboard/department/field-practice', 'order' => 4],
                ];
            
            // FMIPA - Ilmu Komputer
            case 'FMIPA_ILKOM':
                return [
                    ['id' => 41, 'name' => 'Layanan Akademik', 'path' => '/dashboard/department/academic', 'order' => 1],
                    ['id' => 42, 'name' => 'Lab Programming', 'path' => '/dashboard/department/programming-lab', 'order' => 2],
                    ['id' => 43, 'name' => 'Lab Jaringan', 'path' => '/dashboard/department/network-lab', 'order' => 3],
                    ['id' => 44, 'name' => 'Layanan Server & IT', 'path' => '/dashboard/department/it-services', 'order' => 4],
                    ['id' => 45, 'name' => 'Bimbingan Tugas Akhir', 'path' => '/dashboard/department/thesis-guidance', 'order' => 5],
                ];
            
            // FMIPA - Matematika
            case 'FMIPA_MAT':
                return [
                    ['id' => 41, 'name' => 'Layanan Akademik', 'path' => '/dashboard/department/academic', 'order' => 1],
                    ['id' => 42, 'name' => 'Lab Matematika', 'path' => '/dashboard/department/math-lab', 'order' => 2],
                    ['id' => 43, 'name' => 'Konsultasi Statistik', 'path' => '/dashboard/department/statistics-consultation', 'order' => 3],
                    ['id' => 44, 'name' => 'Bimbingan Tugas Akhir', 'path' => '/dashboard/department/thesis-guidance', 'order' => 4],
                ];
            
            // FK - Farmasi
            case 'FK_FARM':
                return [
                    ['id' => 41, 'name' => 'Layanan Akademik', 'path' => '/dashboard/department/academic', 'order' => 1],
                    ['id' => 42, 'name' => 'Lab Farmasi', 'path' => '/dashboard/department/pharmacy-lab', 'order' => 2],
                    ['id' => 43, 'name' => 'Praktek Apoteker', 'path' => '/dashboard/department/pharmacist-practice', 'order' => 3],
                    ['id' => 44, 'name' => 'Konsultasi Obat', 'path' => '/dashboard/department/drug-consultation', 'order' => 4],
                ];
            
            // Default untuk jurusan lain
            default:
                return [
                    ['id' => 41, 'name' => 'Layanan Akademik', 'path' => '/dashboard/department/academic', 'order' => 1],
                    ['id' => 42, 'name' => 'Layanan Administrasi', 'path' => '/dashboard/department/administration', 'order' => 2],
                ];
        }
    }

    /**
     * Get department display name
     */
    private function getDepartmentDisplayName($departmentCode)
    {
        $names = [
            'BIO' => 'Biologi',
            'ILKOM' => 'Ilmu Komputer',
            'MAT' => 'Matematika',
            'KIM' => 'Kimia',
            'FIS' => 'Fisika',
            'FARM' => 'Farmasi',
            'DOKTER' => 'Pendidikan Dokter',
        ];

        return $names[$departmentCode] ?? $departmentCode;
    }

    /**
     * Get menu for admin users
     */
    private function getAdminMenu()
    {
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
