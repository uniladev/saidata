<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SSOService
{
    protected $ssoBaseUrl;
    protected $ssoApiKey;

    public function __construct()
    {
        $this->ssoBaseUrl = config('services.sso.base_url');
        $this->ssoApiKey = config('services.sso.api_key');
    }

    /**
     * Verify user credentials with campus SSO
     * 
     * @param string $username username is the username
     * @param string $password
     * @return array
     */
    public function verifyCredentials(string $username, string $password)
    {
        try {
            // Call campus SSO API
            $response = Http::timeout(10)
                ->withHeaders([
                    'X-API-Key' => $this->ssoApiKey,
                    'Accept' => 'application/json',
                ])
                ->post($this->ssoBaseUrl . '/api/auth/verify', [
                    'username' => $username, // Send username as username
                    'password' => $password,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                // Check if SSO verification was successful
                if ($data['success'] ?? false) {
                    return [
                        'success' => true,
                        'data' => [
                            'username' => $data['data']['username'] ?? $username,
                            'name' => $data['data']['name'] ?? $data['data']['full_name'] ?? 'Unknown',
                            'email' => $data['data']['email'] ?? null,
                            'role' => $this->determineRole($data['data']),
                        ]
                    ];
                }
            }

            // SSO verification failed
            return [
                'success' => false,
                'message' => 'Invalid credentials'
            ];

        } catch (\Exception $e) {
            Log::error('SSO verification failed', [
                'username' => $username,
                'error' => $e->getMessage()
            ]);

            // For development: allow mock login
            if (config('app.env') === 'local' && config('services.sso.mock_enabled')) {
                return $this->mockSSOResponse($username);
            }

            throw new \Exception('SSO service unavailable');
        }
    }

    /**
     * Determine user role from SSO data
     * 
     * @param array $data
     * @return string
     */
    private function determineRole(array $data)
    {
        // Check if user is a student
        if (!empty($data['username']) || !empty($data['student_id'])) {
            return 'student';
        }

        // Check if user is staff/lecturer
        if (!empty($data['nip']) || !empty($data['employee_id'])) {
            return isset($data['is_lecturer']) && $data['is_lecturer'] ? 'lecturer' : 'staff';
        }

        // Check explicit role field
        if (!empty($data['role'])) {
            return $data['role'];
        }

        return 'user';
    }

    /**
     * Mock SSO response for development
     * 
     * @param string $username
     * @return array
     */
    private function mockSSOResponse(string $username)
    {
        // Mock users for testing
        $mockUsers = [
            '2267051001' => [
                'username' => '2267051001',
                'name' => 'Dafahan',
                'email' => 'dafahan@students.unila.ac.id',
                'role' => 'student',
            ],
            'admin' => [
                'username' => 'admin',
                'name' => 'Administrator',
                'email' => 'admin@unila.ac.id',
                'role' => 'admin',
            ],
            'lecturer01' => [
                'username' => 'lecturer01',
                'name' => 'Dr. John Lecturer',
                'email' => 'john.lecturer@unila.ac.id',
                'role' => 'lecturer',
            ],
        ];

        if (isset($mockUsers[$username])) {
            Log::info('Using mock SSO response', ['username' => $username]);
            
            return [
                'success' => true,
                'data' => $mockUsers[$username]
            ];
        }

        return [
            'success' => false,
            'message' => 'Invalid credentials'
        ];
    }

    /**
     * Get user info from SSO by username
     * 
     * @param string $username
     * @return array|null
     */
    public function getUserInfo(string $username)
    {
        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'X-API-Key' => $this->ssoApiKey,
                    'Accept' => 'application/json',
                ])
                ->get($this->ssoBaseUrl . '/api/users/' . $username);

            if ($response->successful()) {
                return $response->json();
            }

            return null;

        } catch (\Exception $e) {
            Log::error('Failed to get SSO user info', [
                'username' => $username,
                'error' => $e->getMessage()
            ]);

            return null;
        }
    }
}