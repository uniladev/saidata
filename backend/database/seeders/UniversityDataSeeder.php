<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UniversityDataSeeder extends Seeder
{
    /**
     * Run the database seeds with SIMPLIFIED EMBEDDED structure
     */
    public function run(): void
    {
        // Clear existing data
        Faculty::query()->delete();
        User::whereIn('username', ['2267051001', '2267051002', '2267011001', '2267051003', 'admin'])->delete();

        echo "🗑️  Cleared existing data\n";

        // ============================================
        // 1. CREATE FACULTIES WITH EMBEDDED DEPARTMENTS & STUDY PROGRAMS
        // ============================================
        
        // FMIPA dengan embedded departments
        Faculty::create([
            'code' => 'FMIPA',
            'name' => 'Fakultas Matematika dan Ilmu Pengetahuan Alam',
            'departments' => [
                [
                    'code' => 'BIO',
                    'name' => 'Biologi',
                    'study_programs' => [
                        [
                            'code' => 'BIO-S1',
                            'name' => 'Biologi',
                            'degree' => 'S1',
                            'duration_years' => 4
                        ],
                        [
                            'code' => 'BIO-S2',
                            'name' => 'Biologi',
                            'degree' => 'S2',
                            'duration_years' => 2
                        ]
                    ]
                ],
                [
                    'code' => 'ILKOM',
                    'name' => 'Ilmu Komputer',
                    'study_programs' => [
                        [
                            'code' => 'ILKOM-S1',
                            'name' => 'Ilmu Komputer',
                            'degree' => 'S1',
                            'duration_years' => 4
                        ],
                        [
                            'code' => 'ILKOM-S2',
                            'name' => 'Ilmu Komputer',
                            'degree' => 'S2',
                            'duration_years' => 2
                        ]
                    ]
                ],
                [
                    'code' => 'MAT',
                    'name' => 'Matematika',
                    'study_programs' => [
                        [
                            'code' => 'MAT-S1',
                            'name' => 'Matematika',
                            'degree' => 'S1',
                            'duration_years' => 4
                        ]
                    ]
                ],
                [
                    'code' => 'KIM',
                    'name' => 'Kimia',
                    'study_programs' => [
                        [
                            'code' => 'KIM-S1',
                            'name' => 'Kimia',
                            'degree' => 'S1',
                            'duration_years' => 4
                        ]
                    ]
                ],
                [
                    'code' => 'FIS',
                    'name' => 'Fisika',
                    'study_programs' => [
                        [
                            'code' => 'FIS-S1',
                            'name' => 'Fisika',
                            'degree' => 'S1',
                            'duration_years' => 4
                        ]
                    ]
                ]
            ]
        ]);

        // FK dengan embedded departments
        Faculty::create([
            'code' => 'FK',
            'name' => 'Fakultas Kedokteran',
            'departments' => [
                [
                    'code' => 'DOKTER',
                    'name' => 'Pendidikan Dokter',
                    'study_programs' => [
                        [
                            'code' => 'DOKTER-PROFESI',
                            'name' => 'Pendidikan Dokter',
                            'degree' => 'Profesi',
                            'duration_years' => 6
                        ]
                    ]
                ],
                [
                    'code' => 'FARM',
                    'name' => 'Farmasi',
                    'study_programs' => [
                        [
                            'code' => 'FARM-S1',
                            'name' => 'Farmasi',
                            'degree' => 'S1',
                            'duration_years' => 4
                        ],
                        [
                            'code' => 'FARM-PROFESI',
                            'name' => 'Apoteker',
                            'degree' => 'Profesi',
                            'duration_years' => 1
                        ]
                    ]
                ]
            ]
        ]);

        // FEB dengan embedded departments
        Faculty::create([
            'code' => 'FEB',
            'name' => 'Fakultas Ekonomi dan Bisnis',
            'departments' => [
                [
                    'code' => 'AKUN',
                    'name' => 'Akuntansi',
                    'study_programs' => [
                        [
                            'code' => 'AKUN-S1',
                            'name' => 'Akuntansi',
                            'degree' => 'S1',
                            'duration_years' => 4
                        ]
                    ]
                ],
                [
                    'code' => 'MAN',
                    'name' => 'Manajemen',
                    'study_programs' => [
                        [
                            'code' => 'MAN-S1',
                            'name' => 'Manajemen',
                            'degree' => 'S1',
                            'duration_years' => 4
                        ]
                    ]
                ]
            ]
        ]);

        echo "✅ Faculties with embedded departments created\n";

        // ============================================
        // 2. CREATE USERS WITH EMBEDDED PROFILE
        // ============================================

        // Mahasiswa 1: Biologi FMIPA
        User::create([
            'username' => '2267051001',
            'name' => 'Budi Santoso',
            'email' => 'budi.santoso@students.unila.ac.id',
            'role' => 'user',
            'password' => Hash::make('password123'),
            'profile' => [
                'faculty_code' => 'FMIPA',
                'department_code' => 'BIO',
                'study_program_code' => 'BIO-S1',
                'student_id' => '2267051001',
                'phone' => '081234567890',
            ]
        ]);

        // Mahasiswa 2: Ilmu Komputer FMIPA
        User::create([
            'username' => '2267051002',
            'name' => 'Siti Rahma',
            'email' => 'siti.rahma@students.unila.ac.id',
            'role' => 'user',
            'password' => Hash::make('password123'),
            'profile' => [
                'faculty_code' => 'FMIPA',
                'department_code' => 'ILKOM',
                'study_program_code' => 'ILKOM-S1',
                'student_id' => '2267051002',
                'phone' => '081234567891',
            ]
        ]);

        // Mahasiswa 3: Farmasi FK
        User::create([
            'username' => '2267011001',
            'name' => 'Andi Wijaya',
            'email' => 'andi.wijaya@students.unila.ac.id',
            'role' => 'user',
            'password' => Hash::make('password123'),
            'profile' => [
                'faculty_code' => 'FK',
                'department_code' => 'FARM',
                'study_program_code' => 'FARM-S1',
                'student_id' => '2267011001',
                'phone' => '081234567892',
            ]
        ]);

        // Mahasiswa 4: Matematika FMIPA
        User::create([
            'username' => '2267051003',
            'name' => 'Dewi Lestari',
            'email' => 'dewi.lestari@students.unila.ac.id',
            'role' => 'user',
            'password' => Hash::make('password123'),
            'profile' => [
                'faculty_code' => 'FMIPA',
                'department_code' => 'MAT',
                'study_program_code' => 'MAT-S1',
                'student_id' => '2267051003',
                'phone' => '081234567893',
            ]
        ]);

        // Admin user (no profile needed)
        User::create([
            'username' => 'admin',
            'name' => 'Administrator',
            'email' => 'admin@unila.ac.id',
            'role' => 'admin',
            'password' => Hash::make('admin123'),
        ]);

        echo "✅ Users with embedded profile created\n";
        echo "\n";
        echo "📚 Faculties (simplified structure):\n";
        echo "  - FMIPA: 5 departments (BIO, ILKOM, MAT, KIM, FIS)\n";
        echo "  - FK: 2 departments (DOKTER, FARM)\n";
        echo "  - FEB: 2 departments (AKUN, MAN)\n";
        echo "\n";
        echo "👥 Users:\n";
        echo "  1. 2267051001 / password123 - Budi Santoso (Biologi FMIPA)\n";
        echo "  2. 2267051002 / password123 - Siti Rahma (Ilmu Komputer FMIPA)\n";
        echo "  3. 2267011001 / password123 - Andi Wijaya (Farmasi FK)\n";
        echo "  4. 2267051003 / password123 - Dewi Lestari (Matematika FMIPA)\n";
        echo "  5. admin / admin123 - Administrator\n";
        echo "\n";
        echo "📝 Structure:\n";
        echo "  - Faculty: {code, name, departments[]}\n";
        echo "  - Department: {code, name, study_programs[]}\n";
        echo "  - Study Program: {code, name, degree, duration_years}\n";
        echo "  - User: {username, name, email, role, profile{faculty_code, department_code, study_program_code, student_id, phone}}\n";
    }
}
