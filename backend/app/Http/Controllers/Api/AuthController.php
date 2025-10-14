<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SSOService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\User;

class AuthController extends Controller
{
    protected $ssoService;

    public function __construct(SSOService $ssoService)
    {
        $this->ssoService = $ssoService;
    }

    /**
     * Login via SSO and issue JWT tokens
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        dd($request);
        // Validate input
        $validator = Validator::make($request->all(), [
            'username' => 'required|string', // NPM from SSO
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $username = $request->username; // NPM is the username
        $password = $request->password;

        try {
            // Verify credentials with campus SSO
            //$ssoResponse = $this->ssoService->verifyCredentials($username, $password);
            $ssoResponse = [
                'success' => true,
                'data' => [
                    'username'=>'2267051001',
                    'name' => 'Dafahan',
                    'email' => 'dafahan@example.com',
                    'role' => 'user'
                ]
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
            $user->refresh_token_expires_at = now()->addDays(7);
            $user->save();

            // Return response with access token and set refresh token cookie
            return response()->json([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ])->cookie(
                'refresh_token',
                $refreshToken,
                60 * 24 * 7, // 7 days in minutes
                '/',
                null,
                config('app.env') === 'production', // secure - only HTTPS in production
                true, // httpOnly
                false,
                'strict' // sameSite
            );

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current authenticated user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
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
     * Logout and invalidate tokens
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        try {
            // Get the authenticated user
            $user = JWTAuth::parseToken()->authenticate();

            // Invalidate the JWT token
            JWTAuth::invalidate(JWTAuth::getToken());

            // Clear refresh token from database
            if ($user) {
                $user->refresh_token = null;
                $user->refresh_token_expires_at = null;
                $user->save();
            }

            // Clear refresh token cookie
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
     * Refresh access token using refresh token from cookie
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh(Request $request)
    {
        // Get refresh token from cookie
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return response()->json([
                'success' => false,
                'message' => 'Refresh token not found'
            ], 401);
        }

        try {
            // Hash the token to compare with database
            $hashedToken = hash('sha256', $refreshToken);

            // Find user with this refresh token
            $user = User::where('refresh_token', $hashedToken)
                ->where('refresh_token_expires_at', '>', now())
                ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired refresh token'
                ], 401)->withoutCookie('refresh_token');
            }

            // Generate new access token
            $newAccessToken = JWTAuth::fromUser($user);

            // Generate new refresh token (token rotation)
            $newRefreshToken = $this->generateRefreshToken();

            // Update refresh token in database
            $user->refresh_token = hash('sha256', $newRefreshToken);
            $user->refresh_token_expires_at = now()->addDays(7);
            $user->save();

            // Return new access token and set new refresh token cookie
            return response()->json([
                'success' => true,
                'token' => $newAccessToken
            ])->cookie(
                'refresh_token',
                $newRefreshToken,
                60 * 24 * 7, // 7 days
                '/',
                null,
                config('app.env') === 'production',
                true, // httpOnly
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

        if (!$user) {
            $user = User::create([
                'username' => $ssoData['username'],
                'name' => $ssoData['name'],
                'email' => $ssoData['email'],
                'role' => $ssoData['role'] ?? 'user',
                'username' => $ssoData['username'] ?? null,
            ]);
        } else {
            // Update user data from SSO
            $user->update([
                'name' => $ssoData['name'],
                'email' => $ssoData['email'],
                'role' => $ssoData['role'] ?? $user->role,
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