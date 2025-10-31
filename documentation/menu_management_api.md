# Menu Management System Documentation

## Overview
Sistem menu management dengan hierarki 3 level dan role-based access control (RBAC) untuk admin universitas, fakultas, dan jurusan.

## Menu Hierarchy

### Level 1: Categories (dengan icon)
- Dashboard
- Layanan Universitas
- Update Data
- Layanan Fakultas
- Layanan Jurusan
- Riwayat Permohonan

### Level 2: Subcategories atau Forms (tanpa icon)
- Bisa berupa subcategory (untuk mengelompokkan forms)
- Atau langsung berupa form

### Level 3: Forms only (tanpa icon)
- Hanya bisa berupa form
- Tidak bisa berupa category atau subcategory

## Role-Based Access Control

### Admin Universitas (admin_univ)
- **Profile**: Tidak memiliki `faculty_code` dan `department_code`
- **Akses**: Kelola menu dengan scope `universitas` dan `update_data`
- **Contoh**: Menambah form di "Layanan Universitas" atau "Update Data"

### Admin Fakultas (admin_fakultas)
- **Profile**: Memiliki `faculty_code`, tidak memiliki `department_code`
- **Akses**: Kelola menu dengan scope `fakultas` dan sesuai `faculty_code`
- **Contoh**: Admin FT hanya bisa mengelola menu "Layanan Fakultas" dengan `faculty_code = "FT"`

### Admin Jurusan (admin_jurusan)
- **Profile**: Memiliki `faculty_code` dan `department_code`
- **Akses**: Kelola menu dengan scope `jurusan` dan sesuai `department_code`
- **Contoh**: Admin IF hanya bisa mengelola menu "Layanan Jurusan" dengan `department_code = "IF"`

## Special Rules

### Update Data Category
- **Scope**: `update_data` (khusus admin_univ)
- **Isi**: Hanya boleh Level 2 forms (tidak ada subcategories)
- **Contoh**: "Update Data Mahasiswa", "Update Data Dosen" langsung sebagai forms

### Icons
- **Level 1**: Wajib memiliki icon (contoh: `fas fa-home`)
- **Level 2**: Tidak boleh memiliki icon
- **Level 3**: Tidak boleh memiliki icon

### Cascade Delete
- Menghapus menu parent akan otomatis menghapus semua children-nya
- Contoh: Hapus "Layanan Fakultas" → semua submenu di dalamnya ikut terhapus

## API Endpoints

Base URL: `/api/v1/management/menu`

### 1. Get All Menus (Index)
**GET** `/api/v1/management/menu`

**Authorization**: Bearer Token (admin only)

**Query Parameters**:
- `scope` (optional): Filter by scope (universitas, fakultas, jurusan, update_data)
- `level` (optional): Filter by level (1, 2, 3)

**Response**:
```json
{
  "success": true,
  "message": "Menus retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Layanan Universitas",
      "level": 1,
      "scope": "universitas",
      "type": "category",
      "icon": "fas fa-university",
      "parent_id": null,
      "order": 2,
      "is_active": true,
      "children": [...]
    }
  ]
}
```

### 2. Create Menu
**POST** `/api/v1/management/menu`

**Authorization**: Bearer Token (admin only)

**Request Body**:
```json
{
  "name": "Surat Keterangan Mahasiswa",
  "level": 2,
  "scope": "universitas",
  "type": "form",
  "parent_id": "507f1f77bcf86cd799439011",
  "route": "/forms/surat-keterangan",
  "form_id": "507f1f77bcf86cd799439012",
  "is_active": true,
  "order": 1
}
```

**Validation Rules**:
- `name`: required, string, max 255
- `level`: required, integer, min 1, max 3
- `scope`: required, in [universitas, fakultas, jurusan, update_data]
- `type`: required, in [category, subcategory, form]
- `icon`: nullable, string (only for level 1)
- `parent_id`: nullable, exists in menus collection
- `route`: nullable, string
- `form_id`: nullable, exists in forms collection
- `faculty_code`: nullable, string (for scope fakultas)
- `department_code`: nullable, string (for scope jurusan)
- `is_active`: boolean (default true)
- `order`: integer, min 0

**Response**:
```json
{
  "success": true,
  "message": "Menu created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Surat Keterangan Mahasiswa",
    "level": 2,
    "scope": "universitas",
    "type": "form",
    ...
  }
}
```

### 3. Get Menu by ID
**GET** `/api/v1/management/menu/{id}`

**Authorization**: Bearer Token (admin only)

**Response**:
```json
{
  "success": true,
  "message": "Menu retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Layanan Universitas",
    "parent": null,
    "children": [...]
  }
}
```

### 4. Update Menu
**PUT** `/api/v1/management/menu/{id}`

**Authorization**: Bearer Token (admin only)

**Request Body** (partial update):
```json
{
  "name": "Updated Menu Name",
  "is_active": false,
  "order": 5
}
```

**Updatable Fields**:
- `name`: string
- `icon`: string (only for level 1)
- `route`: string
- `form_id`: string
- `is_active`: boolean
- `order`: integer

**Response**:
```json
{
  "success": true,
  "message": "Menu updated successfully",
  "data": {...}
}
```

### 5. Delete Menu (Cascade)
**DELETE** `/api/v1/management/menu/{id}`

**Authorization**: Bearer Token (admin only)

**Response**:
```json
{
  "success": true,
  "message": "Menu and 3 children deleted successfully"
}
```

### 6. Reorder Menus
**POST** `/api/v1/management/menu/reorder`

**Authorization**: Bearer Token (admin only)

**Request Body**:
```json
{
  "menus": [
    {"id": "507f1f77bcf86cd799439011", "order": 1},
    {"id": "507f1f77bcf86cd799439012", "order": 2},
    {"id": "507f1f77bcf86cd799439013", "order": 3}
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Menus reordered successfully"
}
```

## Database Schema

### Collection: `menus`

```javascript
{
  _id: ObjectId,
  name: String,           // Nama menu
  level: Number,          // 1, 2, atau 3
  scope: String,          // universitas, fakultas, jurusan, update_data
  type: String,           // category, subcategory, form
  icon: String,           // Font Awesome class (level 1 only)
  parent_id: ObjectId,    // Reference ke parent menu
  route: String,          // URL route
  form_id: ObjectId,      // Reference ke forms collection
  faculty_code: String,   // Untuk scope fakultas
  department_code: String,// Untuk scope jurusan
  is_active: Boolean,     // Status aktif/nonaktif
  order: Number,          // Urutan tampilan
  created_at: Date,
  updated_at: Date
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "name": ["The name field is required."],
    "level": ["The level must be between 1 and 3."]
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You are not authorized to create menu in this scope"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Menu not found"
}
```

## Usage Examples

### Example 1: Admin Univ menambah form di "Update Data"
```bash
POST /api/v1/management/menu
Authorization: Bearer {token}

{
  "name": "Update Data Mahasiswa",
  "level": 2,
  "scope": "update_data",
  "type": "form",
  "parent_id": "507f1f77bcf86cd799439011",  # ID category "Update Data"
  "form_id": "507f1f77bcf86cd799439999",
  "is_active": true,
  "order": 1
}
```

### Example 2: Admin Fakultas menambah subcategory
```bash
POST /api/v1/management/menu
Authorization: Bearer {token}

{
  "name": "Surat Menyurat",
  "level": 2,
  "scope": "fakultas",
  "type": "subcategory",
  "parent_id": "507f1f77bcf86cd799439011",  # ID category "Layanan Fakultas"
  "faculty_code": "FT",
  "is_active": true,
  "order": 1
}
```

### Example 3: Admin Jurusan menambah form di subcategory
```bash
POST /api/v1/management/menu
Authorization: Bearer {token}

{
  "name": "Surat Keterangan Aktif",
  "level": 3,
  "scope": "jurusan",
  "type": "form",
  "parent_id": "507f1f77bcf86cd799439012",  # ID subcategory
  "department_code": "IF",
  "form_id": "507f1f77bcf86cd799439888",
  "route": "/forms/surat-aktif",
  "is_active": true,
  "order": 1
}
```

## Testing Checklist

- [ ] Login sebagai admin_univ dan tes CRUD menu universitas
- [ ] Login sebagai admin_fakultas dan tes CRUD menu fakultas
- [ ] Login sebagai admin_jurusan dan tes CRUD menu jurusan
- [ ] Validasi: Update Data hanya boleh berisi forms (level 2)
- [ ] Validasi: Level 1 wajib ada icon, Level 2-3 tidak boleh ada icon
- [ ] Validasi: Level 3 hanya boleh type=form
- [ ] Test cascade delete: hapus parent, cek children ikut terhapus
- [ ] Test authorization: admin fakultas tidak bisa edit menu universitas
- [ ] Test reorder: ubah urutan menu, cek tampilan sesuai order
- [ ] Test filter by scope dan level di endpoint GET

## Notes

1. **Menu Level 1** sudah di-seed otomatis saat menjalankan `MenuSeeder`
2. **Level 2 dan 3** harus dibuat melalui API Management
3. **Frontend** akan membaca menu dari endpoint `/api/v1/menu` (MenuController) yang sudah filter sesuai role user
4. **Admin** mengelola menu melalui endpoint `/api/v1/management/menu` (MenuManagementController)
5. **Cascade delete** akan menghapus semua children secara rekursif

## Model Relationships

```php
// Menu.php
public function parent()
{
    return $this->belongsTo(Menu::class, 'parent_id');
}

public function children()
{
    return $this->hasMany(Menu::class, 'parent_id');
}

public function descendants()
{
    return $this->children()->with('descendants');
}
```

## Scopes

```php
Menu::byScope('universitas')->get();
Menu::byFaculty('FT')->get();
Menu::byDepartment('IF')->get();
Menu::active()->get();
```

## Helper Methods

```php
$menu->hasChildren();  // Check if menu has children
$menu->getBreadcrumb(); // Get breadcrumb trail [parent, parent, current]
```
