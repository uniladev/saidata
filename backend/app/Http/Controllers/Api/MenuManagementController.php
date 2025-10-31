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
 *     description="API endpoints for managing hierarchical menu system with profile.class-based authorization. University admin (profile.class='university') manages universitas+update_data scopes, Faculty admin (profile.class='faculty') manages fakultas scope with faculty_code validation, Department admin (profile.class='department') manages jurusan scope with faculty_code+department_code validation."
 * )
 */
class MenuManagementController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/management/menu",
     *     operationId="getMenus",
     *     summary="Get all menus with hierarchy (Admin Only)",
     *     description="Retrieve menu hierarchy with role-based access control using profile.class field. Admin authorization: University admin (profile.class='university') manages universitas + update_data scopes, Faculty admin (profile.class='faculty') manages fakultas scope with faculty_code filter, Department admin (profile.class='department') manages jurusan scope with faculty_code + department_code filter. Level 1 categories are hardcoded, Level 2-3 items are manageable from database.",
     *     tags={"Menu Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="scope",
     *         in="query",
     *         description="Filter by scope. Authorization rules: University admin (profile.class='university') → universitas+update_data, Faculty admin (profile.class='faculty') → fakultas (with faculty_code), Department admin (profile.class='department') → jurusan (with faculty_code+department_code)",
     *         required=false,
     *         @OA\Schema(type="string", enum={"universitas", "fakultas", "jurusan", "update_data"})
     *     ),
     *     @OA\Parameter(
     *         name="level",
     *         in="query",
     *         description="Filter by level. level=1 returns fixed L1 categories only (flat, no children). level=2 returns L2 menus from database only. level=3 returns L3 menus from database only. Without this parameter, returns complete hierarchy with L1 as parent and L2/L3 as nested children.",
     *         required=false,
     *         @OA\Schema(type="integer", enum={1, 2, 3})
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
     *                 description="Array of menu items. Structure depends on level parameter: level=1 returns flat array of L1 only, level=2/3 returns flat array of L2/L3 only, no level returns hierarchical structure with children",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="string", example="fixed_l1_layanan_universitas", description="Fixed L1 IDs use prefix 'fixed_l1_', database menus use MongoDB ObjectId"),
     *                     @OA\Property(property="name", type="string", example="Layanan Universitas"),
     *                     @OA\Property(property="level", type="integer", example=1, description="Menu level: 1=Fixed category, 2=Subcategory, 3=Form"),
     *                     @OA\Property(property="scope", type="string", example="universitas", enum={"universitas", "fakultas", "jurusan", "update_data"}),
     *                     @OA\Property(property="type", type="string", example="category", enum={"category", "subcategory", "form"}),
     *                     @OA\Property(property="icon", type="string", example="fas fa-university", nullable=true, description="Only L1 categories have icons"),
     *                     @OA\Property(property="parent_id", type="string", example="fixed_l1_layanan_fakultas", nullable=true, description="For L2/L3: references parent menu (fixed L1 ID or ObjectId)"),
     *                     @OA\Property(property="route", type="string", example="/forms/surat-keterangan", nullable=true),
     *                     @OA\Property(property="form_id", type="string", nullable=true),
     *                     @OA\Property(property="faculty_code", type="string", example="FMIPA", nullable=true),
     *                     @OA\Property(property="department_code", type="string", example="ILKOM", nullable=true),
     *                     @OA\Property(property="is_fixed", type="boolean", example=true, description="True for Level 1 fixed categories, false for manageable L2/L3 menus"),
     *                     @OA\Property(property="is_active", type="boolean", example=true),
     *                     @OA\Property(property="order", type="integer", example=2),
     *                     @OA\Property(
     *                         property="children",
     *                         type="array",
     *                         description="Child menu items (L2/L3 nested hierarchy, only present without level parameter)",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Property(property="_id", type="string", example="672313923808a3af4e0806c8"),
     *                             @OA\Property(property="name", type="string", example="Layanan Akademik"),
     *                             @OA\Property(property="level", type="integer", example=2),
     *                             @OA\Property(property="type", type="string", example="category", enum={"category", "subcategory", "form"}),
     *                             @OA\Property(property="parent_id", type="string", example="fixed_l1_layanan_fakultas"),
     *                             @OA\Property(
     *                                 property="children", 
     *                                 type="array", 
     *                                 nullable=true,
     *                                 description="L3 nested children (if L2 is category)",
     *                                 @OA\Items(
     *                                     type="object",
     *                                     @OA\Property(property="_id", type="string", example="672313923808a3af4e0806c9"),
     *                                     @OA\Property(property="name", type="string", example="Transkrip dan Ijazah"),
     *                                     @OA\Property(property="level", type="integer", example=3),
     *                                     @OA\Property(property="type", type="string", example="subcategory", enum={"subcategory", "form"}),
     *                                     @OA\Property(property="parent_id", type="string", example="672313923808a3af4e0806c8")
     *                                 )
     *                             )
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401, 
     *         description="Unauthorized - Invalid JWT token",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthenticated")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403, 
     *         description="Forbidden - Not an admin user or trying to access unauthorized scope based on profile.class",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthorized. Faculty admin (profile.class='faculty') can only access fakultas scope for their faculty_code.")
     *         )
     *     )
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

        // Get fixed L1 categories first
        $fixedL1Categories = $this->getFixedL1Categories($adminType, $user);
        
        // Get manageable menus (L2 and L3 only) from database
        $query = Menu::query();
        
        // Only get L2 and L3 menus (L1 is hardcoded)
        $query->where('level', '>', 1);
        
        // Exclude system menus from management (Dashboard, Riwayat Permohonan, etc.)
        $query->where('scope', '!=', 'system');

        // Validate scope parameter against admin authorization
        $requestedScope = $request->input('scope');
        
        // Filter by scope based on admin class and authorization
        if ($adminType === 'university') {
            // Admin University can manage universitas and update_data scopes
            if ($requestedScope && !in_array($requestedScope, ['universitas', 'update_data'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Admin Universitas can only access universitas and update_data scopes.'
                ], 403);
            }
            
            $query->whereIn('scope', ['universitas', 'update_data']);
            
            if ($requestedScope) {
                $query->where('scope', $requestedScope);
            }
        } elseif ($adminType === 'faculty') {
            $profile = is_object($user->profile) ? (array) $user->profile : $user->profile;
            $facultyCode = $profile['faculty_code'] ?? null;
            
            if (!$facultyCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'Faculty code not found in admin profile. Admin fakultas must have faculty_code.'
                ], 400);
            }
            
            // Admin Faculty can only access fakultas scope with their faculty_code
            if ($requestedScope && $requestedScope !== 'fakultas') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Admin Fakultas can only access fakultas scope.'
                ], 403);
            }
            
            $query->where('scope', 'fakultas')->where('faculty_code', $facultyCode);
        } elseif ($adminType === 'department') {
            $profile = is_object($user->profile) ? (array) $user->profile : $user->profile;
            $departmentCode = $profile['department_code'] ?? null;
            $facultyCode = $profile['faculty_code'] ?? null;
            
            if (!$departmentCode || !$facultyCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'Department/Faculty code not found in admin profile. Admin department must have both codes.'
                ], 400);
            }
            
            // Admin Department can only access jurusan scope with their department_code and faculty_code
            if ($requestedScope && $requestedScope !== 'jurusan') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Admin Jurusan can only access jurusan scope.'
                ], 403);
            }
            
            $query->where('scope', 'jurusan')
                  ->where('faculty_code', $facultyCode)
                  ->where('department_code', $departmentCode);
        }

        if ($request->has('level')) {
            $level = (int) $request->level;
            if ($level === 1) {
                // L1 is hardcoded, return only fixed categories
                return response()->json([
                    'success' => true,
                    'message' => 'Fixed L1 categories retrieved successfully',
                    'data' => $fixedL1Categories
                ]);
            }
            $query->where('level', $level);
        }

        $manageableMenus = $query->orderBy('order')->get();
        
        // Combine fixed L1 with manageable L2/L3
        $allMenus = collect($fixedL1Categories)->concat($manageableMenus);
        $hierarchicalMenus = $this->buildHierarchy($allMenus);

        return response()->json([
            'success' => true,
            'message' => 'Menus retrieved successfully',
            'data' => $hierarchicalMenus
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/management/menu",
     *     operationId="createMenu",
     *     summary="Create a new menu (Admin Only - Role-based Authorization)",
     *     description="Create a new menu item (Level 2 or 3 only - Level 1 categories are fixed). Authorization based on profile.class: University admin creates universitas+update_data scope menus, Faculty admin creates fakultas scope menus (with faculty_code validation), Department admin creates jurusan scope menus (with faculty_code+department_code validation). Level 3 can be both subcategory or form types for flexible hierarchy.",
     *     tags={"Menu Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Menu data to create",
     *         @OA\JsonContent(
     *             required={"name","level","scope","type"},
     *             @OA\Property(property="name", type="string", maxLength=255, example="Surat Keterangan Mahasiswa"),
     *             @OA\Property(property="level", type="integer", minimum=2, maximum=3, example=2, description="Level 1 categories are fixed/hardcoded and cannot be created"),
     *             @OA\Property(property="scope", type="string", enum={"universitas","fakultas","jurusan","update_data"}, example="universitas", description="Scope must match admin authorization: profile.class='university' → universitas/update_data, profile.class='faculty' → fakultas, profile.class='department' → jurusan"),
     *             @OA\Property(property="type", type="string", enum={"category","subcategory","form"}, example="form"),
     *             @OA\Property(property="icon", type="string", maxLength=100, example="fas fa-file", nullable=true),
     *             @OA\Property(property="parent_id", type="string", example="fixed_l1_layanan_fakultas", nullable=true, description="Can be MongoDB ObjectId or fixed L1 category ID (e.g., fixed_l1_layanan_fakultas)"),
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
     *     @OA\Response(response=400, description="Validation error, invalid business rule, or attempt to create Level 1 category"),
     *     @OA\Response(response=403, description="Forbidden - Not authorized to create in this scope based on profile.class or organizational code mismatch")
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
            'level' => 'required|integer|min:2|max:3', // L1 tidak bisa dibuat (fixed)
            'scope' => ['required', Rule::in(['universitas', 'fakultas', 'jurusan', 'update_data'])],
            'type' => ['required', Rule::in(['category', 'subcategory', 'form'])],
            'icon' => 'nullable|string|max:100',
            'parent_id' => 'nullable|string', // Allow fixed L1 IDs or database ObjectIds
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

        // Level 1 categories are fixed/hardcoded - cannot be created
        if ($request->level === 1) {
            return response()->json([
                'success' => false, 
                'message' => 'Level 1 categories are fixed and cannot be created. Only Level 2 and 3 menus can be managed.'
            ], 400);
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

        // Level 3 can be both subcategory and form, no restriction needed
        // Business logic allows flexible L3 structure

        $menuData = $request->only(['name', 'level', 'scope', 'type', 'icon', 'parent_id', 'route', 'form_id', 'faculty_code', 'department_code', 'is_active', 'order']);
        $menu = Menu::create($menuData);

        return response()->json(['success' => true, 'message' => 'Menu created successfully', 'data' => $menu], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/management/menu/{id}",
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

        // Handle fixed L1 categories
        if (str_starts_with($id, 'fixed_l1_')) {
            $fixedL1Categories = $this->getFixedL1Categories($adminType, $user);
            $fixedMenu = collect($fixedL1Categories)->firstWhere('id', $id);
            
            if (!$fixedMenu) {
                return response()->json(['success' => false, 'message' => 'Fixed L1 category not found or not accessible'], 404);
            }
            
            // Get children from database
            $children = Menu::where('parent_id', $id)
                           ->where('scope', $fixedMenu['scope'])
                           ->get();
            
            $fixedMenu['children'] = $children;
            return response()->json(['success' => true, 'message' => 'Fixed L1 category retrieved successfully', 'data' => $fixedMenu]);
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
     *     path="/api/v1/management/menu/{id}",
     *     operationId="updateMenu",
     *     summary="Update menu (Admin Only - Role-based Authorization)",
     *     description="Update an existing menu item with profile.class-based authorization. Admin can only update menus within their authorized scope (University admin: universitas+update_data, Faculty admin: fakultas with faculty_code match, Department admin: jurusan with faculty_code+department_code match). Only name, icon, route, form_id, is_active, and order can be updated.",
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
     *     @OA\Response(response=403, description="Forbidden - Not authorized to update this menu based on profile.class and organizational scope"),
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

        // Level 1 categories are fixed/hardcoded - cannot be updated
        if ($menu->level === 1) {
            return response()->json([
                'success' => false, 
                'message' => 'Level 1 categories are fixed and cannot be updated. Only Level 2 and 3 menus can be managed.'
            ], 400);
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
     *     path="/api/v1/management/menu/{id}",
     *     operationId="deleteMenu",
     *     summary="Delete menu with cascade (Admin Only - Role-based Authorization)",
     *     description="Delete a menu item and all its children recursively (cascade delete) with profile.class-based authorization. Admin can only delete menus within their authorized scope based on organizational hierarchy. This is a permanent operation.",
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
     *     @OA\Response(response=403, description="Forbidden - Not authorized to delete this menu based on profile.class and organizational scope"),
     *     @OA\Response(response=404, description="Menu not found")
     * )
     */
    public function destroy($id)
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

        // Level 1 categories are fixed/hardcoded - cannot be deleted
        if ($menu->level === 1) {
            return response()->json([
                'success' => false, 
                'message' => 'Level 1 categories are fixed and cannot be deleted. Only Level 2 and 3 menus can be managed.'
            ], 400);
        }

        if (!$this->canManageScope($user, $adminType, $menu->scope, $menu->faculty_code, $menu->department_code)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $deletedCount = $this->deleteMenuWithChildren($menu);

        return response()->json(['success' => true, 'message' => "Menu and {$deletedCount} children deleted successfully"]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/management/menu/reorder",
     *     operationId="reorderMenus",
     *     summary="Reorder menus",
     *     description="Bulk update menu order. Only menus that the user has authorization to manage will be updated.",
     *     tags={"Menu Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Array of menus with new order values",
     *         @OA\JsonContent(
     *             required={"menus"},
     *             @OA\Property(
     *                 property="menus",
     *                 type="array",
     *                 minItems=1,
     *                 @OA\Items(
     *                     required={"id","order"},
     *                     @OA\Property(property="id", type="string", example="507f1f77bcf86cd799439011"),
     *                     @OA\Property(property="order", type="integer", minimum=0, example=1)
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Menus reordered successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Menus reordered successfully")
     *         )
     *     ),
     *     @OA\Response(response=400, description="Validation error"),
     *     @OA\Response(response=403, description="Forbidden - Not authorized")
     * )
     */
    public function reorder(Request $request)
    {
        $user = Auth::user();
        $adminType = $this->getAdminType($user);

        if (!$adminType) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'menus' => 'required|array',
            'menus.*.id' => 'required|exists:menus,_id',
            'menus.*.order' => 'required|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validation error', 'errors' => $validator->errors()], 400);
        }

        $updatedCount = 0;
        $unauthorizedMenus = [];
        
        foreach ($request->menus as $menuData) {
            $menu = Menu::find($menuData['id']);
            
            if (!$menu) {
                continue;
            }
            
            if ($this->canManageScope($user, $adminType, $menu->scope, $menu->faculty_code, $menu->department_code)) {
                $menu->update(['order' => $menuData['order']]);
                $updatedCount++;
            } else {
                $unauthorizedMenus[] = $menuData['id'];
            }
        }
        
        if (count($unauthorizedMenus) > 0 && $updatedCount === 0) {
            return response()->json([
                'success' => false, 
                'message' => 'Unauthorized. You do not have permission to reorder these menus.',
                'unauthorized_menu_ids' => $unauthorizedMenus
            ], 403);
        }
        
        if (count($unauthorizedMenus) > 0) {
            return response()->json([
                'success' => true, 
                'message' => "Partially reordered. {$updatedCount} menus updated, " . count($unauthorizedMenus) . " unauthorized menus skipped.",
                'updated_count' => $updatedCount,
                'unauthorized_menu_ids' => $unauthorizedMenus
            ], 200);
        }

        return response()->json([
            'success' => true, 
            'message' => 'Menus reordered successfully',
            'updated_count' => $updatedCount
        ]);
    }

    private function getAdminType($user)
    {
        if (!$user || $user->role !== 'admin') {
            return null;
        }

        $profile = is_object($user->profile) ? (array) $user->profile : $user->profile;
        
        // Use profile.class field to determine admin level
        $adminClass = $profile['class'] ?? null;
        
        // Return the class directly for better logic flow
        return $adminClass; // 'university', 'faculty', 'department'
    }

    private function getFixedL1Categories($adminType, $user)
    {
        $fixedCategories = [];
        $baseId = 'fixed_l1_'; // Prefix untuk ID virtual

        if ($adminType === 'university') {
            $fixedCategories = [
                [
                    'id' => $baseId . 'layanan_universitas',
                    'name' => 'Layanan Universitas',
                    'level' => 1,
                    'scope' => 'universitas',
                    'type' => 'category',
                    'icon' => 'fas fa-university',
                    'parent_id' => null,
                    'route' => null,
                    'form_id' => null,
                    'faculty_code' => null,
                    'department_code' => null,
                    'is_active' => true,
                    'order' => 1,
                    'is_fixed' => true,
                    'children' => []
                ],
                [
                    'id' => $baseId . 'update_data',
                    'name' => 'Update Data',
                    'level' => 1,
                    'scope' => 'update_data',
                    'type' => 'category',
                    'icon' => 'fas fa-edit',
                    'parent_id' => null,
                    'route' => null,
                    'form_id' => null,
                    'faculty_code' => null,
                    'department_code' => null,
                    'is_active' => true,
                    'order' => 2,
                    'is_fixed' => true,
                    'children' => []
                ]
            ];
        } elseif ($adminType === 'faculty') {
            $profile = is_object($user->profile) ? (array) $user->profile : $user->profile;
            $facultyCode = $profile['faculty_code'] ?? null;
            
            $fixedCategories = [
                [
                    'id' => $baseId . 'layanan_fakultas',
                    'name' => 'Layanan Fakultas',
                    'level' => 1,
                    'scope' => 'fakultas',
                    'type' => 'category',
                    'icon' => 'fas fa-building',
                    'parent_id' => null,
                    'route' => null,
                    'form_id' => null,
                    'faculty_code' => $facultyCode,
                    'department_code' => null,
                    'is_active' => true,
                    'order' => 1,
                    'is_fixed' => true,
                    'children' => []
                ]
            ];
        } elseif ($adminType === 'department') {
            $profile = is_object($user->profile) ? (array) $user->profile : $user->profile;
            $facultyCode = $profile['faculty_code'] ?? null;
            $departmentCode = $profile['department_code'] ?? null;
            
            $fixedCategories = [
                [
                    'id' => $baseId . 'layanan_jurusan',
                    'name' => 'Layanan Jurusan',
                    'level' => 1,
                    'scope' => 'jurusan',
                    'type' => 'category',
                    'icon' => 'fas fa-graduation-cap',
                    'parent_id' => null,
                    'route' => null,
                    'form_id' => null,
                    'faculty_code' => $facultyCode,
                    'department_code' => $departmentCode,
                    'is_active' => true,
                    'order' => 1,
                    'is_fixed' => true,
                    'children' => []
                ]
            ];
        }

        return $fixedCategories;
    }

    private function canManageScope($user, $adminType, $scope, $facultyCode = null, $departmentCode = null)
    {
        $profile = is_object($user->profile) ? (array) $user->profile : $user->profile;

        if ($adminType === 'university') {
            // University admin can manage universitas and update_data scopes
            return in_array($scope, ['universitas', 'update_data']);
        } elseif ($adminType === 'faculty') {
            // Faculty admin can only manage fakultas scope with matching faculty_code
            if ($scope !== 'fakultas') {
                return false;
            }
            return $facultyCode === ($profile['faculty_code'] ?? null);
        } elseif ($adminType === 'department') {
            // Department admin can only manage jurusan scope with matching department and faculty codes
            if ($scope !== 'jurusan') {
                return false;
            }
            return $departmentCode === ($profile['department_code'] ?? null) && 
                   $facultyCode === ($profile['faculty_code'] ?? null);
        }

        return false;
    }

    private function buildHierarchy($menus, $parentId = null)
    {
        $branch = [];

        foreach ($menus as $menu) {
            // Handle both array (fixed L1) and object (database menus)
            $menuParentId = is_array($menu) ? ($menu['parent_id'] ?? null) : $menu->parent_id;
            $menuId = is_array($menu) ? $menu['id'] : $menu->_id;
            
            if ($menuParentId == $parentId) {
                $children = $this->buildHierarchy($menus, $menuId);
                if ($children) {
                    if (is_array($menu)) {
                        $menu['children'] = $children;
                    } else {
                        $menu->children = $children;
                    }
                }
                $branch[] = $menu;
            }
        }

        return $branch;
    }

    private function deleteMenuWithChildren($menu)
    {
        $count = 0;
        $children = Menu::where('parent_id', $menu->_id)->get();
        
        foreach ($children as $child) {
            $count += $this->deleteMenuWithChildren($child);
        }
        
        $menu->delete();
        $count++;
        
        return $count;
    }
}
