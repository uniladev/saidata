<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;

Route::prefix('api')->group(function () {
    Route::prefix('v1')->group(function () {
        Route::prefix('auth')->group(function () {
            Route::post('/login', function (Request $request) {
                // Validate input
                $request->validate([
                    'username' => 'required|string',
                    'password' => 'required|string|min:6',
                ]);

                // Sample data - replace with actual authentication logic
                $username = $request->input('username');
                $password = $request->input('password');

                // Mock authentication check
                if ($username === 'test' && $password === 'password') {
                    // Generate sample tokens
                    $accessToken = base64_encode(random_bytes(32));
                    $refreshToken = base64_encode(random_bytes(32));

                    // Sample user data
                    $user = [
                        'id' => 1,
                        'username' => $username,
                        'email' => 'test@example.com',
                        'npm' => '2015051001',
                        'full_name' => 'John Doe',
                        'role' => 'student',
                        'avatar' => null,
                        'created_at' => now()->toISOString(),
                    ];

                    // Set refresh token as HttpOnly cookie
                    return response()->json([
                        'success' => true,
                        'message' => 'Login berhasil',
                        'accessToken' => $accessToken,
                        'user' => $user,
                    ])->cookie(
                        'refreshToken',
                        $refreshToken,
                        60 * 24 * 7, // 7 days
                        '/',
                        null,
                        true, // secure - only HTTPS in production
                        true, // httpOnly
                        false,
                        'strict' // sameSite
                    );
                }

                // Invalid credentials
                return response()->json([
                    'success' => false,
                    'message' => 'Username atau password salah',
                ], 401);
            });

            Route::post('/refresh', function (Request $request) {
                // Get refresh token from cookie
                $refreshToken = $request->cookie('refreshToken');

                if (!$refreshToken) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Refresh token tidak ditemukan',
                    ], 401);
                }

                // Mock token validation - replace with actual logic
                // In production, validate the refresh token against database
                
                // Generate new access token
                $newAccessToken = base64_encode(random_bytes(32));

                return response()->json([
                    'success' => true,
                    'message' => 'Token berhasil diperbarui',
                    'accessToken' => $newAccessToken,
                ]);
            });

            Route::post('/logout', function (Request $request) {
                // Clear refresh token cookie
                return response()->json([
                    'success' => true,
                    'message' => 'Logout berhasil',
                ])->cookie(
                    'refreshToken',
                    '',
                    -1, // expire immediately
                    '/',
                    null,
                    true,
                    true,
                    false,
                    'strict'
                );
            });

            Route::get('/me', function (Request $request) {
                // This would normally use middleware to verify the token
                // For demo purposes, return sample user data
                
                $authHeader = $request->header('Authorization');
                
                if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Unauthorized',
                    ], 401);
                }

                return response()->json([
                    'success' => true,
                    'user' => [
                        'id' => 1,
                        'username' => 'test',
                        'email' => 'test@example.com',
                        'npm' => '2015051001',
                        'full_name' => 'John Doe',
                        'role' => 'student',
                        'avatar' => null,
                        'created_at' => now()->toISOString(),
                    ],
                ]);
            });
        });
    });
});