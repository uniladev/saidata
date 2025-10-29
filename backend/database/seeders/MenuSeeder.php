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

        echo "Seeding initial menu categories...\n";

        // Level 1 Categories - These are fixed and displayed based on user role
        $menus = [
            [
                'name' => 'Dashboard',
                'level' => 1,
                'scope' => 'universitas', // Accessible to all
                'type' => 'category',
                'icon' => 'fas fa-home',
                'parent_id' => null,
                'route' => '/dashboard',
                'form_id' => null,
                'faculty_code' => null,
                'department_code' => null,
                'is_active' => true,
                'order' => 1
            ],
            [
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
                'order' => 2
            ],
            [
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
                'order' => 3
            ],
            [
                'name' => 'Layanan Fakultas',
                'level' => 1,
                'scope' => 'fakultas',
                'type' => 'category',
                'icon' => 'fas fa-building',
                'parent_id' => null,
                'route' => null,
                'form_id' => null,
                'faculty_code' => null, // Will be set dynamically based on user's faculty
                'department_code' => null,
                'is_active' => true,
                'order' => 4
            ],
            [
                'name' => 'Layanan Jurusan',
                'level' => 1,
                'scope' => 'jurusan',
                'type' => 'category',
                'icon' => 'fas fa-graduation-cap',
                'parent_id' => null,
                'route' => null,
                'form_id' => null,
                'faculty_code' => null,
                'department_code' => null, // Will be set dynamically based on user's department
                'is_active' => true,
                'order' => 5
            ],
            [
                'name' => 'Riwayat Permohonan',
                'level' => 1,
                'scope' => 'universitas',
                'type' => 'category',
                'icon' => 'fas fa-history',
                'parent_id' => null,
                'route' => '/history',
                'form_id' => null,
                'faculty_code' => null,
                'department_code' => null,
                'is_active' => true,
                'order' => 6
            ]
        ];

        foreach ($menus as $menuData) {
            Menu::create($menuData);
            echo "  ✓ Created: {$menuData['name']} (Level {$menuData['level']}, Scope: {$menuData['scope']})\n";
        }

        echo "\n✅ Successfully seeded " . count($menus) . " menu categories.\n";
        echo "\nNote:\n";
        echo "- Level 2 and Level 3 menus should be created via the Menu Management API\n";
        echo "- Layanan Fakultas and Layanan Jurusan menus will be filtered based on user profile\n";
        echo "- Update Data category can only contain Level 2 forms (no subcategories)\n";
    }
}
