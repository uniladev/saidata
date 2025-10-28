<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SSOService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\User;
use MongoDB\BSON\UTCDateTime;

/**
 * @OA\Tag(
 *     name="Authentication",
 *     description="API Endpoints for user authentication"
 * )
 */
class AuthController extends Controller
{
    protected $ssoService;

    public function __construct(SSOService $ssoService)
    {
        $this->ssoService = $ssoService;
    }

    /**
     * @OA\Post(
     *     path="/api/v1/auth/login",
     *     summary="Login via SSO",
     *     description="Authenticate user with campus SSO credentials and receive JWT tokens",
     *     operationId="login",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         description="User credentials",
     *         @OA\JsonContent(
     *             required={"username","password"},
     *             @OA\Property(property="username", type="string", example="2267051001", description="NPM from SSO"),
     *             @OA\Property(property="password", type="string", format="password", example="password123", description="User password (min 6 characters)")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful login",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="token", type="string", example="eyJ0eXAiOiJKV1QiLCJhbGc..."),
     *             @OA\Property(
     *                 property="user",
     *                 type="object",
     *                 @OA\Property(property="id", type="string", example="68ee2e761fa10bc4f109c732"),
     *                 @OA\Property(property="name", type="string", example="Dafahan"),
     *                 @OA\Property(property="email", type="string", example="dafahan@example.com"),
     *                 @OA\Property(property="role", type="string", example="user")
     *             )
     *         ),
     *         @OA\Header(
     *             header="Set-Cookie",
     *             description="HTTP-only refresh token cookie",
     *             @OA\Schema(type="string", example="refresh_token=abc123...; HttpOnly; Secure; SameSite=Strict")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid credentials",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Username atau password salah")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation error"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(property="username", type="array", @OA\Items(type="string", example="The username field is required.")),
     *                 @OA\Property(property="password", type="array", @OA\Items(type="string", example="The password must be at least 6 characters."))
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Login failed: Internal server error")
     *         )
     *     )
     * )
     */
    public function login(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $username = $request->username;
        $password = $request->password;

        try {
            // Verify credentials with campus SSO
            // Mock SSO response based on username (match seeder data)
            /*
                SALAH struktur nya
            */
            $mockUsers = [
                '2267051001' => [
                    'username' => '2267051001',
                    'name' => 'Dafahan',
                    'email' => 'dafahan@students.unila.ac.id',
                    'role' => 'user',
                    'faculty_code' => 'FMIPA',
                    'department_code' => 'ILKOM',
                    'study_program_code' => 'ILKOM-S1',
                    'phone' => '081234567890',
                ],
                '2267051002' => [
                    'username' => '2267051002',
                    'email' => 'siti.rahma@students.unila.ac.id',
                    'role' => 'user',
                    'profile' => [
                        'name' => 'Siti Rahma',
                        'faculty_code' => 'FE',
                        'department_code' => 'AK',
                        'study_program_code' => 'AK-S1',
                        'phone' => '081234567891',
                    ],
                ],
                '2267011001' => [
                    'username' => '2267011001',
                    'name' => 'Andi Wijaya',
                    'email' => 'andi.wijaya@students.unila.ac.id',
                    'role' => 'user',
                    'faculty_code' => 'FK',
                    'department_code' => 'FARM',
                    'study_program_code' => 'FARM-S1',
                    'phone' => '081234567892',
                ],
                '2267051003' => [
                    'username' => '2267051003',
                    'name' => 'Dewi Lestari',
                    'email' => 'dewi.lestari@students.unila.ac.id',
                    'role' => 'user',
                    'faculty_code' => 'FMIPA',
                    'department_code' => 'MAT',
                    'study_program_code' => 'MAT-S1',
                    'phone' => '081234567893',
                ],
                'admin' => [
                    'username' => 'admin',
                    'name' => 'Administrator',
                    'email' => 'admin@unila.ac.id',
                    'role' => 'admin',
                ],
                
            ];

            $ssoData = $mockUsers[$username] ?? null;
            $ssoResponse = [
                'success' => $ssoData !== null,
                'data' => $ssoData
            ];

            if (!$ssoResponse['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Username atau password salah'
                ], 401);
            }

            // Get or create user from SSO data
            $user = $this->getOrCreateUser($ssoResponse['data']);
            
            // Generate JWT access token
            $token = JWTAuth::fromUser($user);

            // Generate refresh token (random string)
            $refreshToken = $this->generateRefreshToken();

            // Store refresh token in database
            $user->refresh_token = hash('sha256', $refreshToken);
            $user->refresh_token_expires_at = new UTCDateTime(now()->addDays(7)->timestamp * 1000);
            $user->save();

            // Return response with access token and set refresh token cookie
            $profile = $user->profile ?? [];
            if (is_object($profile)) {
                $profile = (array) $profile;
            }

            
            return response()->json([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $profile['name'] ?? null,
                    'email' => $user->email,
                    'role' => $user->role,
                    'faculty_code' => $profile['faculty_code'] ?? null,
                    'department_code' => $profile['department_code'] ?? null,
                    'study_program_code' => $profile['study_program_code'] ?? null,
                    'phone' => $profile['phone'] ?? null,
                ]
            ])->cookie(
                'refresh_token',
                $refreshToken,
                60 * 24 * 7, // 7 days in minutes
                '/',
                null,
                config('app.env') === 'production',
                true,
                false,
                'strict'
            );

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/auth/me",
     *     summary="Get current user",
     *     description="Get authenticated user information",
     *     operationId="me",
     *     tags={"Authentication"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="User information retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="string", example="68ee2e761fa10bc4f109c732"),
     *                 @OA\Property(property="name", type="string", example="Dafahan"),
     *                 @OA\Property(property="email", type="string", example="dafahan@example.com"),
     *                 @OA\Property(property="role", type="string", example="user")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized - Invalid or missing token",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Token invalid or expired")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="User not found")
     *         )
     *     )
     * )
     */
    public function me(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ]);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token invalid or expired'
            ], 401);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/auth/logout",
     *     summary="Logout user",
     *     description="Invalidate JWT token and clear refresh token",
     *     operationId="logout",
     *     tags={"Authentication"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Successfully logged out",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Logged out successfully")
     *         ),
     *         @OA\Header(
     *             header="Set-Cookie",
     *             description="Clears the refresh token cookie",
     *             @OA\Schema(type="string", example="refresh_token=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Logout failed",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Failed to logout")
     *         )
     *     )
     * )
     */
    public function logout(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            JWTAuth::invalidate(JWTAuth::getToken());

            if ($user) {
                $user->refresh_token = null;
                $user->refresh_token_expires_at = null;
                $user->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ])->withoutCookie('refresh_token');

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to logout'
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/auth/refresh",
     *     summary="Refresh access token",
     *     description="Get a new access token using refresh token from cookie (token rotation enabled)",
     *     operationId="refresh",
     *     tags={"Authentication"},
     *     @OA\Response(
     *         response=200,
     *         description="Token refreshed successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="token", type="string", example="eyJ0eXAiOiJKV1QiLCJhbGc...")
     *         ),
     *         @OA\Header(
     *             header="Set-Cookie",
     *             description="New HTTP-only refresh token cookie (token rotation)",
     *             @OA\Schema(type="string", example="refresh_token=xyz789...; HttpOnly; Secure; SameSite=Strict")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid or expired refresh token",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Invalid or expired refresh token")
     *         ),
     *         @OA\Header(
     *             header="Set-Cookie",
     *             description="Clears the invalid refresh token cookie",
     *             @OA\Schema(type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Failed to refresh token")
     *         )
     *     )
     * )
     */
    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return response()->json([
                'success' => false,
                'message' => 'Refresh token not found'
            ], 401);
        }

        try {
            $hashedToken = hash('sha256', $refreshToken);

            $user = User::where('refresh_token', $hashedToken)
                ->where('refresh_token_expires_at', '>', new UTCDateTime(now()->timestamp * 1000))
                ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired refresh token'
                ], 401)->withoutCookie('refresh_token');
            }

            $newAccessToken = JWTAuth::fromUser($user);
            $newRefreshToken = $this->generateRefreshToken();

            $user->refresh_token = hash('sha256', $newRefreshToken);
            $user->refresh_token_expires_at = new UTCDateTime(now()->addDays(7)->timestamp * 1000);
            $user->save();

            return response()->json([
                'success' => true,
                'token' => $newAccessToken
            ])->cookie(
                'refresh_token',
                $newRefreshToken,
                60 * 24 * 7,
                '/',
                null,
                config('app.env') === 'production',
                true,
                false,
                'strict'
            );

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to refresh token'
            ], 500);
        }
    }

    /**
     * Get or create user from SSO data
     * 
     * @param array $ssoData
     * @return User
     */
    private function getOrCreateUser(array $ssoData)
    {
        $user = User::where('username', $ssoData['username'])->first();

        $profile = null;
        if (isset($ssoData['faculty_code']) && isset($ssoData['department_code']) && isset($ssoData['study_program_code'])) {
            $profile = [
                'faculty_code' => $ssoData['faculty_code'],
                'department_code' => $ssoData['department_code'],
                'study_program_code' => $ssoData['study_program_code'],
                'phone' => $ssoData['phone'] ?? null,
            ];
        }

        if (!$user) {
            $user = User::create([
                'username' => $ssoData['username'],
                'email' => $ssoData['email'],
                'role' => $ssoData['role'] ?? 'user',
                'profile' => $profile,
                'created_at' => now()->timestamp,
                'updated_at' => now()->timestamp,
            ]);
        } else {
            $user->update([
                'email' => $ssoData['email'],
                'role' => $ssoData['role'] ?? $user->role,
                'profile' => $profile,
                'updated_at' => now()->timestamp,
            ]);
        }

        return $user;
    }

    /**
     * Generate a secure random refresh token
     * 
     * @return string
     */
    private function generateRefreshToken()
    {
        return bin2hex(random_bytes(32));
    }
}