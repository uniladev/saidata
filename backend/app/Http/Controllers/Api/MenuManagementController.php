<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

/**
 * @OA\Tag(
 *     name="Menu Management",
 *     description="API endpoints for managing hierarchical menu system with role-based access control"
 * )
 */
class MenuManagementController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/admin/menus",
     *     operationId="getMenus",
     *     summary="Get all menus with hierarchy",
     *     description="Retrieve all menu items filtered by user's admin scope. Admin Univ can see universitas & update_data, Admin Fakultas can see their faculty menus, Admin Jurusan can see their department menus.",
     *     tags={"Menu Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="scope",
     *         in="query",
     *         description="Filter by scope (universitas, fakultas, jurusan, update_data)",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="level",
     *         in="query",
     *         description="Filter by level (1, 2, 3)",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Menus retrieved successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="_id", type="string", example="507f1f77bcf86cd799439011"),
     *                     @OA\Property(property="name", type="string", example="Layanan Universitas"),
     *                     @OA\Property(property="level", type="integer", example=1),
     *                     @OA\Property(property="scope", type="string", example="universitas"),
     *                     @OA\Property(property="type", type="string", example="category"),
     *                     @OA\Property(property="icon", type="string", example="fas fa-university"),
     *                     @OA\Property(property="order", type="integer", example=2),
     *                     @OA\Property(
     *                         property="children",
     *                         type="array",
     *                         @OA\Items(type="object")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized - Invalid token"),
     *     @OA\Response(response=403, description="Forbidden - Not an admin user")
     * )
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $adminType = $this->getAdminType($user);

        if (!$adminType) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only admin users can access menu management.'
            ], 403);
        }

        $query = Menu::query();

        // Filter by scope based on admin type
        if ($adminType === 'admin_univ') {
            $query->whereIn('scope', ['universitas', 'update_data']);
        } elseif ($adminType === 'admin_fakultas') {
            $profile = is_object($user->profile) ? (array) $user->profile : $user->profile;
            $facultyCode = $profile['faculty_code'] ?? null;
            
            if (!$facultyCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'Faculty code not found in profile'
                ], 400);
            }
            
            $query->where('scope', 'fakultas')->where('faculty_code', $facultyCode);
        } elseif ($adminType === 'admin_jurusan') {
            $profile = is_object($user->profile) ? (array) $user->profile : $user->profile;
            $departmentCode = $profile['department_code'] ?? null;
            
            if (!$departmentCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'Department code not found in profile'
                ], 400);
            }
            
            $query->where('scope', 'jurusan')->where('department_code', $departmentCode);
        }

        if ($request->has('scope')) {
            $query->where('scope', $request->scope);
        }

        if ($request->has('level')) {
            $query->where('level', (int) $request->level);
        }

        $menus = $query->orderBy('order')->get();
        $hierarchicalMenus = $this->buildHierarchy($menus);

        return response()->json([
            'success' => true,
            'message' => 'Menus retrieved successfully',
            'data' => $hierarchicalMenus
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/admin/menus",
     *     operationId="createMenu",
     *     summary="Create a new menu",
     *     description="Create a new menu item with validation rules based on level and scope. Update Data scope can only have Level 2 forms. Only Level 1 can have icons.",
     *     tags={"Menu Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Menu data to create",
     *         @OA\JsonContent(
     *             required={"name","level","scope","type"},
     *             @OA\Property(property="name", type="string", maxLength=255, example="Surat Keterangan Mahasiswa"),
     *             @OA\Property(property="level", type="integer", minimum=1, maximum=3, example=2),
     *             @OA\Property(property="scope", type="string", enum={"universitas","fakultas","jurusan","update_data"}, example="universitas"),
     *             @OA\Property(property="type", type="string", enum={"category","subcategory","form"}, example="form"),
     *             @OA\Property(property="icon", type="string", maxLength=100, example="fas fa-file", nullable=true),
     *             @OA\Property(property="parent_id", type="string", example="507f1f77bcf86cd799439011", nullable=true),
     *             @OA\Property(property="route", type="string", maxLength=255, example="/forms/surat-keterangan", nullable=true),
     *             @OA\Property(property="form_id", type="string", example="507f1f77bcf86cd799439012", nullable=true),
     *             @OA\Property(property="faculty_code", type="string", maxLength=10, example="FT", nullable=true),
     *             @OA\Property(property="department_code", type="string", maxLength=10, example="IF", nullable=true),
     *             @OA\Property(property="is_active", type="boolean", example=true, default=true),
     *             @OA\Property(property="order", type="integer", minimum=0, example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Menu created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Menu created successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 @OA\Property(property="_id", type="string", example="507f1f77bcf86cd799439013"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="level", type="integer"),
     *                 @OA\Property(property="scope", type="string")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, description="Validation error or invalid business rule"),
     *     @OA\Response(response=403, description="Forbidden - Not authorized to create in this scope")
     * )
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $adminType = $this->getAdminType($user);

        if (!$adminType) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'level' => 'required|integer|min:1|max:3',
            'scope' => ['required', Rule::in(['universitas', 'fakultas', 'jurusan', 'update_data'])],
            'type' => ['required', Rule::in(['category', 'subcategory', 'form'])],
            'icon' => 'nullable|string|max:100',
            'parent_id' => 'nullable|exists:menus,_id',
            'route' => 'nullable|string|max:255',
            'form_id' => 'nullable|exists:forms,_id',
            'faculty_code' => 'nullable|string|max:10',
            'department_code' => 'nullable|string|max:10',
            'is_active' => 'boolean',
            'order' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validation error', 'errors' => $validator->errors()], 400);
        }

        if (!$this->canManageScope($user, $adminType, $request->scope, $request->faculty_code, $request->department_code)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized scope'], 403);
        }

        if ($request->scope === 'update_data') {
            if ($request->level !== 2 || $request->type !== 'form') {
                return response()->json(['success' => false, 'message' => 'Update Data can only have Level 2 forms'], 400);
            }
        }

        if ($request->level > 1 && $request->icon) {
            return response()->json(['success' => false, 'message' => 'Only Level 1 can have icons'], 400);
        }

        if ($request->level === 3 && $request->type !== 'form') {
            return response()->json(['success' => false, 'message' => 'Level 3 must be forms'], 400);
        }

        $menuData = $request->only(['name', 'level', 'scope', 'type', 'icon', 'parent_id', 'route', 'form_id', 'faculty_code', 'department_code', 'is_active', 'order']);
        $menu = Menu::create($menuData);

        return response()->json(['success' => true, 'message' => 'Menu created successfully', 'data' => $menu], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/admin/menus/{id}",
     *     operationId="showMenu",
     *     summary="Get menu by ID",
     *     description="Retrieve a specific menu item with its parent and children relationships",
     *     tags={"Menu Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Menu MongoDB ObjectId",
     *         required=true,
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Menu retrieved successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="_id", type="string", example="507f1f77bcf86cd799439011"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="level", type="integer"),
     *                 @OA\Property(property="parent", type="object"),
     *                 @OA\Property(
     *                     property="children",
     *                     type="array",
     *                     @OA\Items(type="object")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=403, description="Forbidden - Not authorized"),
     *     @OA\Response(response=404, description="Menu not found")
     * )
     */
    public function show($id)
    {
        $user = Auth::user();
        $adminType = $this->getAdminType($user);

        if (!$adminType) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $menu = Menu::with(['parent', 'children'])->find($id);

        if (!$menu) {
            return response()->json(['success' => false, 'message' => 'Menu not found'], 404);
        }

        if (!$this->canManageScope($user, $adminType, $menu->scope, $menu->faculty_code, $menu->department_code)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        return response()->json(['success' => true, 'message' => 'Menu retrieved successfully', 'data' => $menu]);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/admin/menus/{id}",
     *     operationId="updateMenu",
     *     summary="Update menu",
     *     description="Update an existing menu item. Only name, icon (level 1 only), route, form_id, is_active, and order can be updated.",
     *     tags={"Menu Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Menu MongoDB ObjectId",
     *         required=true,
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Menu fields to update (partial update allowed)",
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", maxLength=255, example="Updated Menu Name"),
     *             @OA\Property(property="icon", type="string", maxLength=100, example="fas fa-star", nullable=true),
     *             @OA\Property(property="route", type="string", maxLength=255, example="/forms/updated-route", nullable=true),
     *             @OA\Property(property="form_id", type="string", nullable=true),
     *             @OA\Property(property="is_active", type="boolean", example=true),
     *             @OA\Property(property="order", type="integer", minimum=0, example=2)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Menu updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Menu updated successfully"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(response=400, description="Validation error or invalid business rule"),
     *     @OA\Response(response=403, description="Forbidden - Not authorized"),
     *     @OA\Response(response=404, description="Menu not found")
     * )
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $adminType = $this->getAdminType($user);

        if (!$adminType) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json(['success' => false, 'message' => 'Menu not found'], 404);
        }

        if (!$this->canManageScope($user, $adminType, $menu->scope, $menu->faculty_code, $menu->department_code)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'icon' => 'nullable|string|max:100',
            'route' => 'nullable|string|max:255',
            'form_id' => 'nullable|exists:forms,_id',
            'is_active' => 'boolean',
            'order' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validation error', 'errors' => $validator->errors()], 400);
        }

        if ($request->has('icon') && $menu->level > 1 && $request->icon) {
            return response()->json(['success' => false, 'message' => 'Only Level 1 can have icons'], 400);
        }

        $menu->update($request->only(['name', 'icon', 'route', 'form_id', 'is_active', 'order']));

        return response()->json(['success' => true, 'message' => 'Menu updated successfully', 'data' => $menu]);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/admin/menus/{id}",
     *     operationId="deleteMenu",
     *     summary="Delete menu with cascade",
     *     description="Delete a menu item and all its children recursively (cascade delete). This is a permanent operation.",
     *     tags={"Menu Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Menu MongoDB ObjectId",
     *         required=true,
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Menu deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Menu and 3 children deleted successfully")
     *         )
     *     ),
     *     @OA\Response(response=403, description="Forbidden - Not authorized"),
     *     @OA\Response(response=404, description="Menu not found")
     * )
     */
    public function destroy($id)
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
