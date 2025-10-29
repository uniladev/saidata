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
     *     summary="Get dynamic menu based on user's faculty, department, and study program",
     *     description="Mengambil data menu dinamis berdasarkan fakultas, jurusan, dan program studi pengguna yang sedang login.",
     *     operationId="getDynamicMenu",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mengambil data menu",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="menu",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="Dashboard"),
     *                         @OA\Property(property="icon", type="string", example="LayoutDashboard"),
     *                         @OA\Property(property="path", type="string", example="/dashboard"),
     *                         @OA\Property(property="order", type="integer", example=1),
     *                         @OA\Property(
     *                             property="roles",
     *                             type="array",
     *                             @OA\Items(type="string", example="user")
     *                         ),
     *                         @OA\Property(
     *                             property="submenu",
     *                             type="array",
     *                             @OA\Items(
     *                                 type="object",
     *                                 @OA\Property(property="id", type="integer", example=2001),
     *                                 @OA\Property(property="name", type="string", example="Create Form"),
     *                                 @OA\Property(property="path", type="string", example="/forms/create"),
     *                                 @OA\Property(property="order", type="integer", example=1)
     *                             )
     *                         )
     *                     )
     *                 ),
     *                 @OA\Property(
     *                     property="user_info",
     *                     type="object",
     *                     @OA\Property(property="faculty", type="string", example="FMIPA"),
     *                     @OA\Property(property="faculty_code", type="string", example="FMIPA"),
     *                     @OA\Property(property="department", type="string", example="ILKOM"),
     *                     @OA\Property(property="department_code", type="string", example="ILKOM"),
     *                     @OA\Property(property="study_program", type="string", example="S1 Ilmu Komputer"),
     *                     @OA\Property(property="study_program_code", type="string", example="ILKOM01")
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthenticated")
     *         )
     *     )
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
