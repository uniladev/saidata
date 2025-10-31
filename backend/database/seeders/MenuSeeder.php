<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * This seeder creates the initial Level 1 menu categories for the system.
     * These categories serve as the main navigation structure for different user roles.
     */
    public function run(): void
    {
        // Clear existing menus
        Menu::truncate();

        echo "Seeding menu categories...\n";

        // =======================================================
        // MANAGEABLE MENUS - Only L2/L3 (L1 is hardcoded/fixed)
        // =======================================================
        echo "\n📝 Creating MANAGEABLE menus (L2/L3 only - L1 is fixed)...\n";
        
        // =====================================================
        // L2 MENUS - UNIVERSITAS SCOPE
        // =====================================================
        $sampleL2Menus = [
            // Layanan Akademik Universitas
            [
                'name' => 'Layanan Akademik',
                'level' => 2,
                'scope' => 'universitas',
                'type' => 'category',
                'parent_id' => 'fixed_l1_layanan_universitas',
                'route' => null,
                'form_id' => null,
                'faculty_code' => null,
                'department_code' => null,
                'is_active' => true,
                'order' => 1
            ],
            // Layanan Kemahasiswaan Universitas
            [
                'name' => 'Layanan Kemahasiswaan',
                'level' => 2,
                'scope' => 'universitas',
                'type' => 'category',
                'parent_id' => 'fixed_l1_layanan_universitas',
                'route' => null,
                'form_id' => null,
                'faculty_code' => null,
                'department_code' => null,
                'is_active' => true,
                'order' => 2
            ],
            // Layanan Umum Universitas
            [
                'name' => 'Layanan Umum',
                'level' => 2,
                'scope' => 'universitas',
                'type' => 'category',
                'parent_id' => 'fixed_l1_layanan_universitas',
                'route' => null,
                'form_id' => null,
                'faculty_code' => null,
                'department_code' => null,
                'is_active' => true,
                'order' => 3
            ],

            // =====================================================
            // L2 MENUS - FAKULTAS SCOPE (FMIPA)
            // =====================================================
            // Layanan Akademik Fakultas
            [
                'name' => 'Layanan Akademik',
                'level' => 2,
                'scope' => 'fakultas',
                'type' => 'category',
                'parent_id' => 'fixed_l1_layanan_fakultas',
                'route' => null,
                'form_id' => null,
                'faculty_code' => 'FMIPA',
                'department_code' => null,
                'is_active' => true,
                'order' => 1
            ],
            // Layanan Kemahasiswaan Fakultas
            [
                'name' => 'Layanan Kemahasiswaan',
                'level' => 2,
                'scope' => 'fakultas',
                'type' => 'category',
                'parent_id' => 'fixed_l1_layanan_fakultas',
                'route' => null,
                'form_id' => null,
                'faculty_code' => 'FMIPA',
                'department_code' => null,
                'is_active' => true,
                'order' => 2
            ],
            // Layanan Umum Fakultas
            [
                'name' => 'Layanan Umum',
                'level' => 2,
                'scope' => 'fakultas',
                'type' => 'category',
                'parent_id' => 'fixed_l1_layanan_fakultas',
                'route' => null,
                'form_id' => null,
                'faculty_code' => 'FMIPA',
                'department_code' => null,
                'is_active' => true,
                'order' => 3
            ],

            // =====================================================
            // UPDATE DATA SCOPE
            // =====================================================
            [
                'name' => 'Update Profile',
                'level' => 2,
                'scope' => 'update_data',
                'type' => 'form',
                'parent_id' => 'fixed_l1_update_data',
                'route' => '/forms/update-profile',
                'form_id' => null,
                'faculty_code' => null,
                'department_code' => null,
                'is_active' => true,
                'order' => 1
            ]
        ];

        // Create L2 menus first and store IDs for L3 references
        echo "Creating L2 menus...\n";
        $createdL2Menus = [];
        foreach ($sampleL2Menus as $menuData) {
            $menu = Menu::create($menuData);
            $createdL2Menus[$menuData['name'] . '_' . $menuData['scope']] = $menu->_id;
            echo "✓ Created L2: {$menuData['name']} ({$menuData['scope']})\n";
        }

        // =====================================================
        // L3 MENUS - UNIVERSITAS SCOPE
        // =====================================================
        $sampleL3Menus = [
            // Layanan Akademik Universitas - L3 Subcategory
            [
                'name' => 'Transkrip dan Ijazah',
                'level' => 3,
                'scope' => 'universitas',
                'type' => 'subcategory',
                'parent_id' => $createdL2Menus['Layanan Akademik_universitas'],
                'route' => null,
                'form_id' => null,
                'faculty_code' => null,
                'department_code' => null,
                'is_active' => true,
                'order' => 1
            ],
            // Layanan Akademik Universitas - L3 Direct Form
            [
                'name' => 'Surat Keterangan Aktif Mahasiswa',
                'level' => 3,
                'scope' => 'universitas',
                'type' => 'form',
                'parent_id' => $createdL2Menus['Layanan Akademik_universitas'],
                'route' => '/forms/surat-aktif-mahasiswa',
                'form_id' => null,
                'faculty_code' => null,
                'department_code' => null,
                'is_active' => true,
                'order' => 2
            ],

            // Layanan Kemahasiswaan Universitas - L3 Direct Forms
            [
                'name' => 'Surat Rekomendasi Beasiswa',
                'level' => 3,
                'scope' => 'universitas',
                'type' => 'form',
                'parent_id' => $createdL2Menus['Layanan Kemahasiswaan_universitas'],
                'route' => '/forms/rekomendasi-beasiswa',
                'form_id' => null,
                'faculty_code' => null,
                'department_code' => null,
                'is_active' => true,
                'order' => 1
            ],
            [
                'name' => 'Permohonan Cuti Akademik',
                'level' => 3,
                'scope' => 'universitas',
                'type' => 'form',
                'parent_id' => $createdL2Menus['Layanan Kemahasiswaan_universitas'],
                'route' => '/forms/cuti-akademik',
                'form_id' => null,
                'faculty_code' => null,
                'department_code' => null,
                'is_active' => true,
                'order' => 2
            ],

            // Layanan Umum Universitas - L3 Direct Forms
            [
                'name' => 'Surat Keterangan Kelakuan Baik',
                'level' => 3,
                'scope' => 'universitas',
                'type' => 'form',
                'parent_id' => $createdL2Menus['Layanan Umum_universitas'],
                'route' => '/forms/kelakuan-baik',
                'form_id' => null,
                'faculty_code' => null,
                'department_code' => null,
                'is_active' => true,
                'order' => 1
            ],

            // =====================================================
            // L3 MENUS - FAKULTAS SCOPE (FMIPA)
            // =====================================================
            // Layanan Akademik Fakultas - L3 Subcategory
            [
                'name' => 'Legalisir Dokumen',
                'level' => 3,
                'scope' => 'fakultas',
                'type' => 'subcategory',
                'parent_id' => $createdL2Menus['Layanan Akademik_fakultas'],
                'route' => null,
                'form_id' => null,
                'faculty_code' => 'FMIPA',
                'department_code' => null,
                'is_active' => true,
                'order' => 1
            ],
            // Layanan Akademik Fakultas - L3 Direct Form
            [
                'name' => 'Surat Keterangan Mahasiswa Aktif',
                'level' => 3,
                'scope' => 'fakultas',
                'type' => 'form',
                'parent_id' => $createdL2Menus['Layanan Akademik_fakultas'],
                'route' => '/forms/surat-mahasiswa-aktif-fakultas',
                'form_id' => null,
                'faculty_code' => 'FMIPA',
                'department_code' => null,
                'is_active' => true,
                'order' => 2
            ],

            // Layanan Kemahasiswaan Fakultas - L3 Direct Forms
            [
                'name' => 'Permohonan Organisasi Mahasiswa',
                'level' => 3,
                'scope' => 'fakultas',
                'type' => 'form',
                'parent_id' => $createdL2Menus['Layanan Kemahasiswaan_fakultas'],
                'route' => '/forms/organisasi-mahasiswa',
                'form_id' => null,
                'faculty_code' => 'FMIPA',
                'department_code' => null,
                'is_active' => true,
                'order' => 1
            ],
            [
                'name' => 'Surat Rekomendasi Kegiatan',
                'level' => 3,
                'scope' => 'fakultas',
                'type' => 'form',
                'parent_id' => $createdL2Menus['Layanan Kemahasiswaan_fakultas'],
                'route' => '/forms/rekomendasi-kegiatan',
                'form_id' => null,
                'faculty_code' => 'FMIPA',
                'department_code' => null,
                'is_active' => true,
                'order' => 2
            ],

            // Layanan Umum Fakultas - L3 Direct Forms
            [
                'name' => 'Surat Keterangan Penelitian',
                'level' => 3,
                'scope' => 'fakultas',
                'type' => 'form',
                'parent_id' => $createdL2Menus['Layanan Umum_fakultas'],
                'route' => '/forms/keterangan-penelitian',
                'form_id' => null,
                'faculty_code' => 'FMIPA',
                'department_code' => null,
                'is_active' => true,
                'order' => 1
            ]
        ];

        // =====================================================
        // CREATE L3 MENUS
        // =====================================================
        echo "\nCreating L3 menus...\n";
        foreach ($sampleL3Menus as $menuData) {
            $menu = Menu::create($menuData);
            echo "✓ Created L3: {$menuData['name']} ({$menuData['scope']}) - Type: {$menuData['type']}\n";
        }
        
        echo "\n✅ Successfully seeded:\n";
        echo "- " . count($sampleL2Menus) . " L2 menus (categories)\n";
        echo "- " . count($sampleL3Menus) . " L3 menus (subcategories + forms)\n";

        echo "\n🔒 FIXED L1 Categories (Hardcoded - NOT in database):\n";
        echo "- 'Layanan Universitas' (Admin Univ only)\n";
        echo "- 'Update Data' (Admin Univ only)\n";
        echo "- 'Layanan Fakultas' (Admin Fakultas - filtered by faculty_code)\n";
        echo "- 'Layanan Jurusan' (Admin Jurusan - filtered by department_code)\n";

        echo "\n📝 Admin Can Manage:\n";
        echo "- 🎯 Admin Univ: L2/L3 under 'Layanan Universitas' + 'Update Data'\n";
        echo "- 🎯 Admin Fakultas: L2/L3 under 'Layanan Fakultas' (their faculty only)\n";
        echo "- 🎯 Admin Jurusan: L2/L3 under 'Layanan Jurusan' (their department only)\n";
        
        echo "\n⚠️  L1 Categories:\n";
        echo "- Cannot be created, updated, or deleted via API\n";
        echo "- Names are generic: 'Layanan Fakultas', 'Layanan Jurusan' (no specific names)\n";
        echo "- Content filtered by admin's faculty_code/department_code\n";
    }
}
