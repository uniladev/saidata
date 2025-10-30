<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;

class SystemMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * This seeder creates FIXED system menus that cannot be managed by admins.
     * These are read-only menus with fixed routes and functionality.
     */
    public function run(): void
    {
        echo "\n🔒 Creating FIXED system menus (NOT manageable)...\n";
        
        // FIXED SYSTEM MENUS - Cannot be managed via Menu Management
        $systemMenus = [
            [
                'name' => 'Dashboard',
                'level' => 1,
                'scope' => 'system', // Special scope for system menus
                'type' => 'system',
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
                'name' => 'Riwayat Permohonan',
                'level' => 1,
                'scope' => 'system', // Special scope for system menus
                'type' => 'system',
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

        foreach ($systemMenus as $menuData) {
            Menu::create($menuData);
            echo "  🔒 Created: {$menuData['name']} (System Menu - Route: {$menuData['route']})\n";
        }

        echo "\n✅ Successfully seeded " . count($systemMenus) . " FIXED system menus.\n";
        echo "\nSystem Menu Characteristics:\n";
        echo "- Scope: 'system' (not accessible via Menu Management API)\n";
        echo "- Type: 'system' (different from manageable 'category' type)\n";
        echo "- Fixed routes that cannot be changed\n";
        echo "- Visible to all users but not manageable by any admin\n";
    }
}
