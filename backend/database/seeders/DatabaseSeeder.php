<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UniversityDataSeeder::class,
            MenuSeeder::class,        // Manageable menus for students
        ]);

        // Create test admin users for Menu Management testing
        $testUsers = [
            [
                'username' => 'admin_univ',
                'name' => 'Admin Universitas',
                'email' => 'admin.univ@test.com',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'profile' => [
                    'full_name' => 'Admin Universitas Test',
                    'phone' => '081234567890',
                    // No faculty_code or department_code = Admin Univ
                ]
            ],
            [
                'username' => 'admin_fmipa',
                'name' => 'Admin FMIPA',
                'email' => 'admin.fmipa@test.com',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'profile' => [
                    'full_name' => 'Admin FMIPA Test',
                    'phone' => '081234567891',
                    'faculty_code' => 'FMIPA',
                    // No department_code = Admin Fakultas
                ]
            ],
            [
                'username' => 'admin_ilkom',
                'name' => 'Admin Ilmu Komputer',
                'email' => 'admin.ilkom@test.com',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'profile' => [
                    'full_name' => 'Admin Ilkom Test',
                    'phone' => '081234567892',
                    'faculty_code' => 'FMIPA',
                    'department_code' => 'ILKOM',
                ]
            ]
        ];

        foreach ($testUsers as $userData) {
            User::create($userData);
            echo "✅ Created test user: {$userData['username']} ({$userData['name']})\n";
        }
    }
}
