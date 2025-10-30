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
        
        // Sample L2 menus for different scopes (parent_id will use fixed L1 IDs)
        $sampleL2Menus = [
            // Universitas scope examples
            [
                'name' => 'Surat Rekomendasi',
                'level' => 2,
                'scope' => 'universitas',
                'type' => 'category',
                'parent_id' => 'fixed_l1_layanan_universitas', // Reference to fixed L1
                'route' => null,
                'form_id' => null,
                'faculty_code' => null,
                'department_code' => null,
                'is_active' => true,
                'order' => 1
            ],
            // Update data scope example
            [
                'name' => 'Update Profile',
                'level' => 2,
                'scope' => 'update_data',
                'type' => 'form',
                'parent_id' => 'fixed_l1_update_data', // Reference to fixed L1
                'route' => '/forms/update-profile',
                'form_id' => null,
                'faculty_code' => null,
                'department_code' => null,
                'is_active' => true,
                'order' => 1
            ]
        ];

        // Sample fakultas scope L2 menus
        $fakultasL2Menus = [
            // FMIPA examples
            [
                'name' => 'Permohonan Surat Keterangan',
                'level' => 2,
                'scope' => 'fakultas',
                'type' => 'category',
                'parent_id' => 'fixed_l1_layanan_fakultas', // Reference to fixed L1
                'route' => null,
                'form_id' => null,
                'faculty_code' => 'FMIPA',
                'department_code' => null,
                'is_active' => true,
                'order' => 1
            ],
            [
                'name' => 'Legalisir Dokumen',
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
            // FK examples
            [
                'name' => 'Surat Rekomendasi',
                'level' => 2,
                'scope' => 'fakultas',
                'type' => 'category',
                'parent_id' => 'fixed_l1_layanan_fakultas',
                'route' => null,
                'form_id' => null,
                'faculty_code' => 'FK',
                'department_code' => null,
                'is_active' => true,
                'order' => 1
            ]
        ];

        // Sample jurusan scope L2 menus
        $jurusanL2Menus = [
            // ILKOM examples
            [
                'name' => 'Surat Aktif Kuliah',
                'level' => 2,
                'scope' => 'jurusan',
                'type' => 'category',
                'parent_id' => 'fixed_l1_layanan_jurusan', // Reference to fixed L1
                'route' => null,
                'form_id' => null,
                'faculty_code' => 'FMIPA',
                'department_code' => 'ILKOM',
                'is_active' => true,
                'order' => 1
            ],
            [
                'name' => 'Verifikasi Dokumen',
                'level' => 2,
                'scope' => 'jurusan',
                'type' => 'category',
                'parent_id' => 'fixed_l1_layanan_jurusan',
                'route' => null,
                'form_id' => null,
                'faculty_code' => 'FMIPA',
                'department_code' => 'ILKOM',
                'is_active' => true,
                'order' => 2
            ],
            // BIO examples
            [
                'name' => 'Surat Keterangan',
                'level' => 2,
                'scope' => 'jurusan',
                'type' => 'category',
                'parent_id' => 'fixed_l1_layanan_jurusan',
                'route' => null,
                'form_id' => null,
                'faculty_code' => 'FMIPA',
                'department_code' => 'BIO',
                'is_active' => true,
                'order' => 1
            ]
        ];

        // Combine all manageable menus (L2 only for demo)
        $manageableMenus = array_merge($sampleL2Menus, $fakultasL2Menus, $jurusanL2Menus);

        foreach ($manageableMenus as $menuData) {
            Menu::create($menuData);
            echo "  ✓ Created: {$menuData['name']} (Level {$menuData['level']}, Scope: {$menuData['scope']})\n";
        }

        echo "\n✅ Successfully seeded " . count($manageableMenus) . " MANAGEABLE menu items (L2 samples).\n";

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
