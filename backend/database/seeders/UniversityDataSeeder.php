<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\Department;
use App\Models\StudyProgram;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UniversityDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ============================================
        // 1. CREATE FACULTIES
        // ============================================
        $fmipa = Faculty::create([
            'code' => 'FMIPA',
            'name' => 'Fakultas Matematika dan Ilmu Pengetahuan Alam',
            'description' => 'FMIPA Universitas Lampung'
        ]);

        $fk = Faculty::create([
            'code' => 'FK',
            'name' => 'Fakultas Kedokteran',
            'description' => 'FK Universitas Lampung'
        ]);

        $feb = Faculty::create([
            'code' => 'FEB',
            'name' => 'Fakultas Ekonomi dan Bisnis',
            'description' => 'FEB Universitas Lampung'
        ]);

        // ============================================
        // 2. CREATE DEPARTMENTS FOR FMIPA
        // ============================================
        $biologi = Department::create([
            'faculty_id' => $fmipa->id,
            'code' => 'BIO',
            'name' => 'Biologi',
            'description' => 'Jurusan Biologi'
        ]);

        $ilkom = Department::create([
            'faculty_id' => $fmipa->id,
            'code' => 'ILKOM',
            'name' => 'Ilmu Komputer',
            'description' => 'Jurusan Ilmu Komputer'
        ]);

        $matematika = Department::create([
            'faculty_id' => $fmipa->id,
            'code' => 'MAT',
            'name' => 'Matematika',
            'description' => 'Jurusan Matematika'
        ]);

        $kimia = Department::create([
            'faculty_id' => $fmipa->id,
            'code' => 'KIM',
            'name' => 'Kimia',
            'description' => 'Jurusan Kimia'
        ]);

        $fisika = Department::create([
            'faculty_id' => $fmipa->id,
            'code' => 'FIS',
            'name' => 'Fisika',
            'description' => 'Jurusan Fisika'
        ]);

        // ============================================
        // 3. CREATE DEPARTMENTS FOR FK
        // ============================================
        $pendidikanDokter = Department::create([
            'faculty_id' => $fk->id,
            'code' => 'DOKTER',
            'name' => 'Pendidikan Dokter',
            'description' => 'Program Studi Pendidikan Dokter'
        ]);

        $farmasi = Department::create([
            'faculty_id' => $fk->id,
            'code' => 'FARM',
            'name' => 'Farmasi',
            'description' => 'Program Studi Farmasi'
        ]);

        // ============================================
        // 4. CREATE STUDY PROGRAMS
        // ============================================
        
        // FMIPA - Biologi
        $biologiS1 = StudyProgram::create([
            'department_id' => $biologi->id,
            'code' => 'BIO-S1',
            'name' => 'Biologi',
            'degree' => 'S1',
            'description' => 'Program Studi S1 Biologi'
        ]);

        // FMIPA - Ilmu Komputer
        $ilkomS1 = StudyProgram::create([
            'department_id' => $ilkom->id,
            'code' => 'ILKOM-S1',
            'name' => 'Ilmu Komputer',
            'degree' => 'S1',
            'description' => 'Program Studi S1 Ilmu Komputer'
        ]);

        // FMIPA - Matematika
        $matS1 = StudyProgram::create([
            'department_id' => $matematika->id,
            'code' => 'MAT-S1',
            'name' => 'Matematika',
            'degree' => 'S1',
            'description' => 'Program Studi S1 Matematika'
        ]);

        // FK - Farmasi
        $farmasiS1 = StudyProgram::create([
            'department_id' => $farmasi->id,
            'code' => 'FARM-S1',
            'name' => 'Farmasi',
            'degree' => 'S1',
            'description' => 'Program Studi S1 Farmasi'
        ]);

        // FK - Pendidikan Dokter
        $dokterProfesi = StudyProgram::create([
            'department_id' => $pendidikanDokter->id,
            'code' => 'DOKTER-PROFESI',
            'name' => 'Pendidikan Dokter',
            'degree' => 'Profesi',
            'description' => 'Program Profesi Dokter'
        ]);

        // ============================================
        // 5. CREATE DUMMY USERS (MAHASISWA)
        // ============================================

        // Mahasiswa 1: Biologi FMIPA
        $userBio = User::create([
            'username' => '2267051001',
            'name' => 'Budi Santoso',
            'email' => 'budi.santoso@students.unila.ac.id',
            'role' => 'user',
            'password' => Hash::make('password123'), // Untuk development saja
        ]);

        UserProfile::create([
            'user_id' => $userBio->id,
            'faculty_id' => $fmipa->id,
            'department_id' => $biologi->id,
            'study_program_id' => $biologiS1->id,
            'student_id' => '2267051001',
            'phone' => '081234567890',
        ]);

        // Mahasiswa 2: Ilmu Komputer FMIPA
        $userIlkom = User::create([
            'username' => '2267051002',
            'name' => 'Siti Rahma',
            'email' => 'siti.rahma@students.unila.ac.id',
            'role' => 'user',
            'password' => Hash::make('password123'),
        ]);

        UserProfile::create([
            'user_id' => $userIlkom->id,
            'faculty_id' => $fmipa->id,
            'department_id' => $ilkom->id,
            'study_program_id' => $ilkomS1->id,
            'student_id' => '2267051002',
            'phone' => '081234567891',
        ]);

        // Mahasiswa 3: Farmasi FK
        $userFarmasi = User::create([
            'username' => '2267011001',
            'name' => 'Andi Wijaya',
            'email' => 'andi.wijaya@students.unila.ac.id',
            'role' => 'user',
            'password' => Hash::make('password123'),
        ]);

        UserProfile::create([
            'user_id' => $userFarmasi->id,
            'faculty_id' => $fk->id,
            'department_id' => $farmasi->id,
            'study_program_id' => $farmasiS1->id,
            'student_id' => '2267011001',
            'phone' => '081234567892',
        ]);

        // Mahasiswa 4: Matematika FMIPA
        $userMat = User::create([
            'username' => '2267051003',
            'name' => 'Dewi Lestari',
            'email' => 'dewi.lestari@students.unila.ac.id',
            'role' => 'user',
            'password' => Hash::make('password123'),
        ]);

        UserProfile::create([
            'user_id' => $userMat->id,
            'faculty_id' => $fmipa->id,
            'department_id' => $matematika->id,
            'study_program_id' => $matS1->id,
            'student_id' => '2267051003',
            'phone' => '081234567893',
        ]);

        // Admin user
        $admin = User::create([
            'username' => 'admin',
            'name' => 'Administrator',
            'email' => 'admin@unila.ac.id',
            'role' => 'admin',
            'password' => Hash::make('admin123'),
        ]);

        $this->command->info('✅ University data seeded successfully!');
        $this->command->info('');
        $this->command->info('📚 Created Faculties:');
        $this->command->info('  - FMIPA (Fakultas MIPA)');
        $this->command->info('  - FK (Fakultas Kedokteran)');
        $this->command->info('');
        $this->command->info('👥 Dummy Users Created:');
        $this->command->info('  1. Username: 2267051001 | Password: password123 | Biologi FMIPA');
        $this->command->info('  2. Username: 2267051002 | Password: password123 | Ilmu Komputer FMIPA');
        $this->command->info('  3. Username: 2267011001 | Password: password123 | Farmasi FK');
        $this->command->info('  4. Username: 2267051003 | Password: password123 | Matematika FMIPA');
        $this->command->info('  5. Username: admin       | Password: admin123    | Administrator');
    }
}
