<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MenuController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/menu",
     *     tags={"Menu"},
     *     summary="Get dynamic menu structure for sidebar navigation",
     *     description="Returns menu structure based on user role. For students (role=user), menus are dynamically loaded from database filtered by faculty_code, department_code. For admins (role=admin), menus are hardcoded management tools only - admin users cannot use service menus, they only manage them.",
     *     operationId="getSidebarMenu",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(
     *         response=200,
     *         description="Successfully retrieved menu structure. Content varies by user role: Admin users get hardcoded management menus (Dashboard, DEVTEST tools, Validation, Settings, Help), Student users get dynamic service menus filtered by organizational attributes (faculty_code, department_code).",
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
     *                     description="User's organizational attributes and admin class",
     *                     @OA\Property(property="faculty", type="string", nullable=true, example="FMIPA"),
     *                     @OA\Property(property="faculty_code", type="string", nullable=true, example="FMIPA"),
     *                     @OA\Property(property="department", type="string", nullable=true, example="ILKOM"),
     *                     @OA\Property(property="department_code", type="string", nullable=true, example="ILKOM"),
     *                     @OA\Property(property="study_program", type="string", nullable=true, example="ILKOM-S1"),
     *                     @OA\Property(property="study_program_code", type="string", nullable=true, example="ILKOM-S1"),
     *                     @OA\Property(property="class", type="string", nullable=true, enum={"university", "faculty", "department"}, example="faculty", description="Admin class for authorization (only present for admin users)")
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
     *     description="Submenu item (L2/L3 from database with nested hierarchy support)",
     *     @OA\Property(property="id", type="string", description="MongoDB ObjectId", example="672313923808a3af4e0806c8"),
     *     @OA\Property(property="name", type="string", description="Display name", example="Layanan Akademik"),
     *     @OA\Property(property="path", type="string", nullable=true, description="Route path (null for categories with submenu)", example="/forms/surat-aktif-kuliah"),
     *     @OA\Property(property="order", type="integer", description="Display order", example=1),
     *     @OA\Property(property="type", type="string", enum={"category", "subcategory", "form"}, description="Menu item type", example="category"),
     *     @OA\Property(
     *         property="submenu",
     *         type="array",
     *         nullable=true,
     *         description="L3 children (only present if this L2 item has nested items)",
     *         @OA\Items(
     *             type="object",
     *             @OA\Property(property="id", type="string", description="MongoDB ObjectId of L3 menu", example="672313923808a3af4e0806c9"),
     *             @OA\Property(property="name", type="string", description="L3 item name", example="Transkrip dan Ijazah"),
     *             @OA\Property(property="path", type="string", nullable=true, description="Route path", example="/forms/transkrip"),
     *             @OA\Property(property="order", type="integer", description="Display order within L2", example=1),
     *             @OA\Property(property="type", type="string", enum={"subcategory", "form"}, description="L3 item type", example="subcategory")
     *         )
     *     )
     * )
     *
     * @OA\Schema(
     *     schema="UserOrganizationalInfo",
     *     description="User's organizational attributes and admin class from profile",
     *     @OA\Property(property="faculty", type="string", nullable=true, example="FMIPA"),
     *     @OA\Property(property="faculty_code", type="string", nullable=true, example="FMIPA"),
     *     @OA\Property(property="department", type="string", nullable=true, example="ILKOM"),
     *     @OA\Property(property="department_code", type="string", nullable=true, example="ILKOM"),
     *     @OA\Property(property="study_program", type="string", nullable=true, example="ILKOM-S1"),
     *     @OA\Property(property="study_program_code", type="string", nullable=true, example="ILKOM-S1"),
     *     @OA\Property(property="class", type="string", nullable=true, enum={"university", "faculty", "department"}, example="faculty", description="Admin class determining authorization scope (only for admin users)")
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

        // Base menu items - Dashboard untuk semua user
        $menuItems = [
            [
                'id' => 1,
                'name' => 'Dashboard',
                'icon' => 'LayoutDashboard',
                'path' => '/dashboard',
                'order' => 1,
                'roles' => ['admin', 'user']
            ]
        ];

        // Menu berdasarkan role
        if ($user->role === 'admin') {
            // ADMIN: Hanya menu manajemen hardcoded, tidak bisa menggunakan layanan
            
            $menuItems[] = [
                'id' => 90909,
                'name' => 'DEVTEST',
                'icon' => 'ClipboardList',
                'order' => 2,
                'roles' => ['admin'],
                'submenu' => [
                    ['id' => 2001, 'name' => 'Create Form', 'path' => '/forms/create', 'order' => 1],
                    ['id' => 2002, 'name' => 'Form List', 'path' => '/forms', 'order' => 2],
                    ['id' => 2003, 'name' => 'Menu Setting', 'path' => '/menu', 'order' => 3],
                    ['id' => 2004, 'name' => 'Table', 'path' => '/table-demo', 'order' => 4, 'submenu' => [['id' => 3001, 'name' => 'Basic Table', 'path' => '/table-demo/basic', 'order' => 1], ['id' => 3002, 'name' => 'Data Table', 'path' => '/table-demo/data-table', 'order' => 2]]],
                ]
            ];
            
            $menuItems[] = [
                'id' => 6,
                'name' => 'Validasi Permohonan',
                'icon' => 'CheckCircle',
                'path' => '/dashboard/validation',
                'order' => 6,
                'roles' => ['admin']
            ];
            
        } elseif ($user->role === 'user') {
            // MAHASISWA: Menu layanan untuk mengajukan permohonan
            $menuItems = array_merge($menuItems, $this->getUserMenu($facultyCode, $departmentCode, $studyProgramCode));
            
            // Riwayat permohonan hanya untuk mahasiswa (tanpa dropdown)
            $menuItems[] = [
                'id' => 100,
                'name' => 'Riwayat Permohonan',
                'icon' => 'History',
                'path' => '/dashboard/requests',
                'order' => 100,
                'roles' => ['user']
            ];
        }

        // Common menu items untuk semua user (di paling bawah)

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

        // Fixed L1 categories untuk mahasiswa dengan submenu dari database
        $fixedL1Categories = [
            [
                'id' => 'fixed_l1_layanan_universitas',
                'name' => 'Layanan Universitas',
                'icon' => 'Building',
                'scope' => 'universitas',
                'order' => 2
            ],
            [
                'id' => 'fixed_l1_layanan_fakultas',
                'name' => 'Layanan Fakultas',
                'icon' => 'GraduationCap',
                'scope' => 'fakultas',
                'order' => 3
            ],
            [
                'id' => 'fixed_l1_layanan_jurusan',
                'name' => 'Layanan Jurusan',
                'icon' => 'BookOpen',
                'scope' => 'jurusan',
                'order' => 4
            ],
            [
                'id' => 'fixed_l1_update_data',
                'name' => 'Update Data',
                'icon' => 'Edit',
                'scope' => 'update_data',
                'order' => 5
            ]
        ];

        foreach ($fixedL1Categories as $category) {
            $submenu = [];
            
            // Query database untuk L2/L3 submenu berdasarkan scope
            $query = Menu::where('parent_id', $category['id'])
                         ->where('scope', $category['scope'])
                         ->where('is_active', true);
            
            // Filter berdasarkan fakultas/jurusan untuk mahasiswa
            if ($category['scope'] === 'fakultas' && $facultyCode) {
                $query->where('faculty_code', $facultyCode);
            } elseif ($category['scope'] === 'jurusan' && $departmentCode && $facultyCode) {
                $query->where('faculty_code', $facultyCode)
                      ->where('department_code', $departmentCode);
            }
            
            $dbMenus = $query->orderBy('order')->get();
            
            // Convert database menus to submenu format and build hierarchy for L3
            foreach ($dbMenus as $dbMenu) {
                $menuItem = [
                    'id' => (string) $dbMenu->_id,
                    'name' => $dbMenu->name,
                    'path' => $dbMenu->route,
                    'order' => $dbMenu->order,
                    'type' => $dbMenu->type
                ];
                
                // If this is L2, get its L3 children
                if ($dbMenu->level == 2) {
                    $l3Children = Menu::where('parent_id', $dbMenu->_id)
                                     ->where('is_active', true)
                                     ->orderBy('order')
                                     ->get();
                    
                    if ($l3Children->isNotEmpty()) {
                        $menuItem['submenu'] = [];
                        foreach ($l3Children as $l3Menu) {
                            $menuItem['submenu'][] = [
                                'id' => (string) $l3Menu->_id,
                                'name' => $l3Menu->name,
                                'path' => $l3Menu->route,
                                'order' => $l3Menu->order,
                                'type' => $l3Menu->type
                            ];
                        }
                    }
                }
                
                $submenu[] = $menuItem;
            }
            
            // Hanya tampilkan kategori jika ada submenu atau untuk universitas/update_data (selalu tampil)
            if (!empty($submenu) || in_array($category['scope'], ['universitas', 'update_data'])) {
                $menu[] = [
                    'id' => $category['id'],
                    'name' => $category['name'],
                    'icon' => $category['icon'],
                    'order' => $category['order'],
                    'roles' => ['user'],
                    'submenu' => $submenu
                ];
            }
        }

        return $menu;
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
        // 1. Get L2 menus from database (Kode Asli Anda)
        $query = \App\Models\Menu::where('parent_id', $fixedL1Id)
                                 ->where('scope', $scope);
                                // ->where('level', 2); // Anda bisa hapus 'level' jika L1 fixedId
        
        // Filter by faculty/department code
        if ($facultyCode) {
            $query->where('faculty_code', $facultyCode);
        }
        if ($departmentCode) {
            $query->where('department_code', $departmentCode);
        }
        
        $l2Menus = $query->orderBy('order')->get();
        
        // 2. Build submenu array
        $submenu = [];
        foreach ($l2Menus as $l2Menu) {
            
            // --- INI LOGIKA BARU UNTUK L3 ---
            // 3. Untuk setiap L2, cari L3 children-nya
            $l3Query = \App\Models\Menu::where('parent_id', $l2Menu->_id) // Parent-nya adalah ID L2
                                     ->where('scope', $scope);
            
            // Terapkan filter scope lagi
            if ($facultyCode) {
                $l3Query->where('faculty_code', $facultyCode);
            }
            if ($departmentCode) {
                $l3Query->where('department_code', $departmentCode);
            }
            
            $l3Menus = $l3Query->orderBy('order')->get();
            
            $l3Submenu = [];
            foreach ($l3Menus as $l3Menu) {
                // Disini kita bisa cek L4 jika mau, tapi kita berhenti di L3
                $l3Submenu[] = [
                    'id' => $l3Menu->_id,
                    'name' => $l3Menu->name,
                    'path' => $l3Menu->route ?? '/dashboard/menu/' . $l3Menu->_id,
                    'order' => $l3Menu->order
                ];
            }
            // --- AKHIR LOGIKA L3 ---

            // 4. Susun node L2
            $l2Node = [
                'id' => $l2Menu->_id,
                'name' => $l2Menu->name,
                'path' => $l2Menu->route ?? '/dashboard/menu/' . $l2Menu->_id,
                'order' => $l2Menu->order
            ];
            
            // 5. Jika L3 submenu-nya ada, tambahkan ke node L2
            if (!empty($l3Submenu)) {
                $l2Node['submenu'] = $l3Submenu;
            }
            
            $submenu[] = $l2Node;
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