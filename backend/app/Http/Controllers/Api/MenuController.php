<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MenuController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/menu",
     *     tags={"Menu"},
     *     summary="Get dynamic menu structure for sidebar navigation",
     *     description="Returns menu structure based on user role and attributes. For students (role=user), menus are fetched from database filtered by faculty_code, department_code. For admins, menus are fetched from database based on their admin type (university/faculty/department) and managed scope.",
     *     operationId="getSidebarMenu",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(
     *         response=200,
     *         description="Successfully retrieved menu structure",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="menu",
     *                     type="array",
     *                     description="Array of menu items sorted by order",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="string", description="Menu ID. Can be integer for fixed menus or string for database menus (e.g., fixed_l1_layanan_fakultas or MongoDB ObjectId)", example="fixed_l1_layanan_fakultas"),
     *                         @OA\Property(property="name", type="string", description="Menu display name", example="Layanan Fakultas"),
     *                         @OA\Property(property="icon", type="string", description="Icon name (Lucide React icon)", example="GraduationCap"),
     *                         @OA\Property(property="path", type="string", description="Route path for menu without submenu", example="/dashboard"),
     *                         @OA\Property(property="order", type="integer", description="Display order", example=2),
     *                         @OA\Property(
     *                             property="roles",
     *                             type="array",
     *                             description="Allowed roles for this menu",
     *                             @OA\Items(type="string", example="admin")
     *                         ),
     *                         @OA\Property(
     *                             property="submenu",
     *                             type="array",
     *                             description="Child menu items (L2/L3 menus from database)",
     *                             @OA\Items(
     *                                 type="object",
     *                                 @OA\Property(property="id", type="string", description="MongoDB ObjectId of L2/L3 menu", example="672313923808a3af4e0806c8"),
     *                                 @OA\Property(property="name", type="string", description="Submenu display name", example="Permohonan Surat Keterangan"),
     *                                 @OA\Property(property="path", type="string", description="Route path", example="/forms/surat-keterangan"),
     *                                 @OA\Property(property="order", type="integer", description="Display order within submenu", example=1)
     *                             )
     *                         )
     *                     )
     *                 ),
     *                 @OA\Property(
     *                     property="user_info",
     *                     type="object",
     *                     description="User's organizational attributes",
     *                     @OA\Property(property="faculty", type="string", nullable=true, example="FMIPA"),
     *                     @OA\Property(property="faculty_code", type="string", nullable=true, example="FMIPA"),
     *                     @OA\Property(property="department", type="string", nullable=true, example="ILKOM"),
     *                     @OA\Property(property="department_code", type="string", nullable=true, example="ILKOM"),
     *                     @OA\Property(property="study_program", type="string", nullable=true, example="ILKOM-S1"),
     *                     @OA\Property(property="study_program_code", type="string", nullable=true, example="ILKOM-S1")
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated - No valid JWT token provided",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthenticated")
     *         )
     *     )
     * )
     *
     * @OA\Schema(
     *     schema="SidebarMenuResponse",
     *     description="Response structure for sidebar menu endpoint",
     *     @OA\Property(
     *         property="success",
     *         type="boolean",
     *         example=true
     *     ),
     *     @OA\Property(
     *         property="data",
     *         type="object",
     *         @OA\Property(
     *             property="menu",
     *             type="array",
     *             description="Complete menu structure for sidebar navigation",
     *             @OA\Items(ref="#/components/schemas/MenuItem")
     *         ),
     *         @OA\Property(
     *             property="user_info",
     *             type="object",
     *             ref="#/components/schemas/UserOrganizationalInfo"
     *         )
     *     )
     * )
     *
     * @OA\Schema(
     *     schema="MenuItem",
     *     description="Single menu item in sidebar navigation",
     *     @OA\Property(property="id", type="string", description="Menu identifier", example="fixed_l1_layanan_fakultas"),
     *     @OA\Property(property="name", type="string", description="Display name", example="Layanan Fakultas"),
     *     @OA\Property(property="icon", type="string", description="Lucide React icon name", example="GraduationCap"),
     *     @OA\Property(property="path", type="string", description="Route path (optional if has submenu)", example="/dashboard"),
     *     @OA\Property(property="order", type="integer", description="Display order", example=2),
     *     @OA\Property(
     *         property="roles",
     *         type="array",
     *         description="Allowed user roles",
     *         @OA\Items(type="string", enum={"admin", "user"})
     *     ),
     *     @OA\Property(
     *         property="submenu",
     *         type="array",
     *         description="Child menu items",
     *         @OA\Items(ref="#/components/schemas/Submenu")
     *     )
     * )
     *
     * @OA\Schema(
     *     schema="Submenu",
     *     description="Submenu item (L2/L3 from database)",
     *     @OA\Property(property="id", type="string", description="MongoDB ObjectId", example="672313923808a3af4e0806c8"),
     *     @OA\Property(property="name", type="string", description="Display name", example="Surat Aktif Kuliah"),
     *     @OA\Property(property="path", type="string", description="Route path", example="/forms/surat-aktif-kuliah"),
     *     @OA\Property(property="order", type="integer", description="Display order", example=1)
     * )
     *
     * @OA\Schema(
     *     schema="UserOrganizationalInfo",
     *     description="User's organizational attributes from profile",
     *     @OA\Property(property="faculty", type="string", nullable=true, example="FMIPA"),
     *     @OA\Property(property="faculty_code", type="string", nullable=true, example="FMIPA"),
     *     @OA\Property(property="department", type="string", nullable=true, example="ILKOM"),
     *     @OA\Property(property="department_code", type="string", nullable=true, example="ILKOM"),
     *     @OA\Property(property="study_program", type="string", nullable=true, example="ILKOM-S1"),
     *     @OA\Property(property="study_program_code", type="string", nullable=true, example="ILKOM-S1")
     * )
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

        // Load user profile (embedded array)
        $profile = $user->profile ?? [];
        if (is_object($profile)) {
            $profile = (array) $profile;
        }
        // Get faculty and department info from profile array
        $facultyCode = $profile['faculty_code'] ?? null;
        $departmentCode = $profile['department_code'] ?? null;
        $studyProgramCode = $profile['study_program_code'] ?? null;

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
                    ['id' => 2004, 'name' => 'Table', 'path' => '/table-demo', 'order' => 4],
                ]
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
     * Fetch from database based on admin type and their managed scope
     */
    private function getAdminMenu()
    {
        $user = Auth::user();
        $profile = $user->profile ?? [];
        if (is_object($profile)) {
            $profile = (array) $profile;
        }
        
        $facultyCode = $profile['faculty_code'] ?? null;
        $departmentCode = $profile['department_code'] ?? null;
        
        // Determine admin type
        $adminType = $this->getAdminType($user);
        
        $menu = [];
        
        // Get fixed L1 categories and their children from database
        if ($adminType === 'admin_univ') {
            // Admin Univ gets Layanan Universitas + Update Data
            $menu[] = $this->buildMenuFromDatabase('fixed_l1_layanan_universitas', 'Layanan Universitas', 'Building', 2, 'universitas');
            $menu[] = $this->buildMenuFromDatabase('fixed_l1_update_data', 'Update Data', 'Edit', 3, 'update_data');
            
        } elseif ($adminType === 'admin_fakultas') {
            // Admin Fakultas gets Layanan Fakultas (filtered by their faculty_code)
            $menu[] = $this->buildMenuFromDatabase('fixed_l1_layanan_fakultas', 'Layanan Fakultas', 'GraduationCap', 2, 'fakultas', $facultyCode);
            
        } elseif ($adminType === 'admin_jurusan') {
            // Admin Jurusan gets Layanan Jurusan (filtered by their department_code)
            $menu[] = $this->buildMenuFromDatabase('fixed_l1_layanan_jurusan', 'Layanan Jurusan', 'Building2', 2, 'jurusan', $facultyCode, $departmentCode);
        }
        
        // Add admin-specific menus
        $menu[] = [
            'id' => 6,
            'name' => 'Validasi Permohonan',
            'icon' => 'CheckCircle',
            'path' => '/dashboard/validation',
            'order' => 6,
            'roles' => ['admin']
        ];
        
        $menu[] = [
            'id' => 7,
            'name' => 'Users',
            'icon' => 'Users',
            'path' => '/dashboard/users',
            'order' => 7,
            'roles' => ['admin']
        ];
        
        $menu[] = [
            'id' => 8,
            'name' => 'Reports',
            'icon' => 'BarChart',
            'path' => '/dashboard/reports',
            'order' => 8,
            'roles' => ['admin']
        ];
        
        return $menu;
    }
    
    /**
     * Build menu structure from database based on fixed L1 category
     */
    private function buildMenuFromDatabase($fixedL1Id, $name, $icon, $order, $scope, $facultyCode = null, $departmentCode = null)
    {
        // Get L2 menus from database
        $query = \App\Models\Menu::where('parent_id', $fixedL1Id)
                                  ->where('scope', $scope)
                                  ->where('level', 2);
        
        // Filter by faculty/department code
        if ($facultyCode) {
            $query->where('faculty_code', $facultyCode);
        }
        if ($departmentCode) {
            $query->where('department_code', $departmentCode);
        }
        
        $l2Menus = $query->orderBy('order')->get();
        
        // Build submenu array
        $submenu = [];
        foreach ($l2Menus as $l2Menu) {
            $submenu[] = [
                'id' => $l2Menu->_id,
                'name' => $l2Menu->name,
                'path' => $l2Menu->route ?? '/dashboard/menu/' . $l2Menu->_id,
                'order' => $l2Menu->order
            ];
        }
        
        return [
            'id' => $fixedL1Id,
            'name' => $name,
            'icon' => $icon,
            'order' => $order,
            'roles' => ['admin'],
            'submenu' => $submenu
        ];
    }
    
    /**
     * Determine admin type based on profile class
     */
    private function getAdminType($user)
    {
        if (!$user || $user->role !== 'admin') {
            return null;
        }

        $profile = is_object($user->profile) ? (array) $user->profile : $user->profile;
        $class = $profile['class'] ?? null;
        
        // Determine by class field
        if ($class === 'university') {
            return 'admin_univ';
        } elseif ($class === 'faculty') {
            return 'admin_fakultas';
        } elseif ($class === 'department') {
            return 'admin_jurusan';
        }

        return null;
    }
}