# Simplified Embedded Structure - Final Version

## 📋 Overview

Struktur database telah **disederhanakan** menjadi **2 collections only** dengan fully embedded documents mengikuti best practice MongoDB.

### Collections:
1. **faculties** - Faculty dengan embedded departments & study programs
2. **users** - User dengan embedded profile
3. **menus** - Dynamic menu system

❌ **Removed:** departments, study_programs, user_profiles collections (sudah tidak dipakai)

---

## 🗄️ Final Database Structure

### 1. Faculty Collection (faculties)

```json
{
  "_id": ObjectId("..."),
  "code": "FMIPA",
  "name": "Fakultas Matematika dan Ilmu Pengetahuan Alam",
  "departments": [
    {
      "code": "BIO",
      "name": "Biologi",
      "study_programs": [
        {
          "code": "BIO-S1",
          "name": "Biologi",
          "degree": "S1",
          "duration_years": 4
        },
        {
          "code": "BIO-S2",
          "name": "Biologi",
          "degree": "S2",
          "duration_years": 2
        }
      ]
    },
    {
      "code": "ILKOM",
      "name": "Ilmu Komputer",
      "study_programs": [
        {
          "code": "ILKOM-S1",
          "name": "Ilmu Komputer",
          "degree": "S1",
          "duration_years": 4
        }
      ]
    }
  ],
  "created_at": "2025-10-22T...",
  "updated_at": "2025-10-22T..."
}
```

**Fields:**
- `code` (string): Faculty code (e.g., "FMIPA", "FK", "FEB")
- `name` (string): Faculty name
- `departments` (array): Array of embedded department objects
  - `code` (string): Department code (e.g., "BIO", "ILKOM")
  - `name` (string): Department name
  - `study_programs` (array): Array of embedded study program objects
    - `code` (string): Program code (e.g., "BIO-S1")
    - `name` (string): Program name
    - `degree` (string): Degree type (e.g., "S1", "S2", "S3", "Profesi")
    - `duration_years` (integer): Program duration in years

---

### 2. User Collection (users)

```json
{
  "_id": ObjectId("..."),
  "username": "2267051001",
  "name": "Budi Santoso",
  "email": "budi.santoso@students.unila.ac.id",
  "password": "$2y$12$...",
  "role": "user",
  "profile": {
    "faculty_code": "FMIPA",
    "department_code": "BIO",
    "study_program_code": "BIO-S1",
    "student_id": "2267051001",
    "phone": "081234567890"
  },
  "refresh_token": null,
  "refresh_token_expires_at": null,
  "created_at": "2025-10-22T...",
  "updated_at": "2025-10-22T..."
}
```

**Fields:**
- `username` (string): Login username
- `name` (string): Full name
- `email` (string): Email address
- `password` (string): Hashed password
- `role` (string): User role ("admin" or "user")
- `profile` (object): Embedded profile document
  - `faculty_code` (string): Faculty code reference
  - `department_code` (string): Department code reference
  - `study_program_code` (string): Study program code reference
  - `student_id` (string): Student ID number
  - `phone` (string): Phone number
- `refresh_token` (string, nullable): JWT refresh token
- `refresh_token_expires_at` (datetime, nullable): Refresh token expiry

---

## 🎨 Faculty Model (`app/Models/Faculty.php`)

### Simplified Model

```php
class Faculty extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'faculties';

    protected $fillable = [
        'code',
        'name',
        'departments', // Array of embedded department documents
    ];

    protected $casts = [
        'departments' => 'array',
    ];

    /**
     * Get department by code from embedded array
     */
    public function getDepartmentByCode($code);

    /**
     * Get study program by code from embedded structure
     */
    public function getStudyProgramByCode($deptCode, $progCode);
}
```

### Usage Examples

```php
// Get faculty
$faculty = Faculty::where('code', 'FMIPA')->first();

// Access departments
foreach ($faculty->departments as $dept) {
    echo $dept['name']; // "Biologi"
    foreach ($dept['study_programs'] as $program) {
        echo $program['name']; // "Biologi S1"
    }
}

// Get specific department
$bioDept = $faculty->getDepartmentByCode('BIO');
// Returns: ['code' => 'BIO', 'name' => 'Biologi', 'study_programs' => [...]]

// Get specific study program
$bioS1 = $faculty->getStudyProgramByCode('BIO', 'BIO-S1');
// Returns: ['code' => 'BIO-S1', 'name' => 'Biologi', 'degree' => 'S1', 'duration_years' => 4]
```

---

## 🎨 User Model (`app/Models/User.php`)

### Model with Embedded Profile

```php
class User extends Authenticatable implements JWTSubject
{
    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'username', 'name', 'email', 'password', 'role',
        'refresh_token', 'refresh_token_expires_at',
        'profile', // Embedded profile document
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'profile' => 'array', // Cast as array for MongoDB
    ];

    protected $appends = [
        'faculty_code',
        'department_code',
        'study_program_code'
    ];

    // Accessor untuk direct access ke codes
    public function getFacultyCodeAttribute();
    public function getDepartmentCodeAttribute();
    public function getStudyProgramCodeAttribute();

    // Accessor untuk full data objects
    public function getFacultyAttribute();
    public function getDepartmentAttribute();
    public function getStudyProgramAttribute();

    // Helper method
    public function updateProfile(array $profileData): bool;
}
```

### Usage Examples

```php
$user = User::where('username', '2267051001')->first();

// Direct access to embedded profile
echo $user->profile->faculty_code;         // "FMIPA"
echo $user->profile->department_code;      // "BIO"
echo $user->profile->study_program_code;   // "BIO-S1"
echo $user->profile->student_id;           // "2267051001"

// Appended attributes (auto-available in JSON response)
echo $user->faculty_code;         // "FMIPA"
echo $user->department_code;      // "BIO"
echo $user->study_program_code;   // "BIO-S1"

// Full data objects (queries Faculty collection)
echo $user->faculty->name;          // "Fakultas Matematika dan Ilmu Pengetahuan Alam"
echo $user->department->name;       // "Biologi"
echo $user->studyProgram->degree;   // "S1"

// Update profile
$user->updateProfile([
    'phone' => '08123456789',
    'student_id' => '2267051001'
]);
```

---

## 🌱 UniversityDataSeeder

### Seeder Structure

```php
// Create Faculty with embedded departments & study programs
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
                ]
            ]
        ]
    ]
]);

// Create User with embedded profile
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
```

### Run Seeder

```bash
php artisan db:seed --class=UniversityDataSeeder
```

**Output:**
```
🗑️  Cleared existing data
✅ Faculties with embedded departments created
✅ Users with embedded profile created

📚 Faculties (simplified structure):
  - FMIPA: 5 departments (BIO, ILKOM, MAT, KIM, FIS)
  - FK: 2 departments (DOKTER, FARM)
  - FEB: 2 departments (AKUN, MAN)

👥 Users:
  1. 2267051001 / password123 - Budi Santoso (Biologi FMIPA)
  2. 2267051002 / password123 - Siti Rahma (Ilmu Komputer FMIPA)
  3. 2267011001 / password123 - Andi Wijaya (Farmasi FK)
  4. 2267051003 / password123 - Dewi Lestari (Matematika FMIPA)
  5. admin / admin123 - Administrator
```

---

## 📊 Data Statistics

### Faculties Created:
1. **FMIPA** - 5 departments
   - Biologi (BIO-S1, BIO-S2)
   - Ilmu Komputer (ILKOM-S1, ILKOM-S2)
   - Matematika (MAT-S1)
   - Kimia (KIM-S1)
   - Fisika (FIS-S1)

2. **FK** - 2 departments
   - Pendidikan Dokter (DOKTER-PROFESI)
   - Farmasi (FARM-S1, FARM-PROFESI)

3. **FEB** - 2 departments
   - Akuntansi (AKUN-S1)
   - Manajemen (MAN-S1)

**Total:** 3 faculties, 9 departments, 11 study programs

---

## 🔥 Benefits

### 1. **Extreme Simplicity**
- ❌ Before: 6 collections (users, user_profiles, faculties, departments, study_programs, menus)
- ✅ After: 3 collections (users, faculties, menus)
- **50% reduction in collections!**

### 2. **Performance**
- ❌ Before: Multiple queries to get user with faculty/department/program
- ✅ After: 1 query gets everything
- **Faster queries, less database round-trips**

### 3. **No Foreign Keys**
- No complex JOIN logic
- No cascade delete issues
- Direct code-based references (faculty_code, department_code)

### 4. **MongoDB Native**
- Follows MongoDB embedded document pattern
- Leverages document-oriented strengths
- Optimal for read-heavy operations

### 5. **Clean Models**
- ❌ Removed: Department.php, StudyProgram.php, UserProfile.php
- ✅ Kept: User.php (with embedded profile), Faculty.php (with embedded departments)
- **Less code to maintain!**

---

## 🎯 Menu API Integration

Menu API **still works perfectly** with this structure!

```php
// MenuController.php - No changes needed!
$user = Auth::user();

$menus = Menu::forUser($user)  // Uses $user->faculty_code, $user->department_code
    ->parentOnly()
    ->with(['children' => function($query) use ($user) {
        $query->forUser($user)->orderBy('order');
    }])
    ->orderBy('order')
    ->get();
```

**Why it works:**
- `$user->faculty_code` returns `"FMIPA"` from embedded profile
- `$user->department_code` returns `"BIO"` from embedded profile
- Menu filtering logic uses these codes to filter menus
- ✅ **Zero changes needed!**

---

## 📝 Summary

### Structure Hierarchy:
```
Faculty
└── departments[] (embedded)
    └── study_programs[] (embedded)

User
└── profile{} (embedded)
    ├── faculty_code (references Faculty.code)
    ├── department_code (references Department.code in Faculty.departments)
    └── study_program_code (references StudyProgram.code in Department.study_programs)
```

### Key Principles:
1. **Faculties** store all academic structure (departments & programs embedded)
2. **Users** store profile data directly (no separate collection)
3. **Codes** are used for lightweight references (not ObjectIds)
4. **Accessors** provide convenient object access when needed
5. **Menu API** uses codes for filtering (no database queries needed)

---

**Created:** October 22, 2025  
**Version:** 3.0.0 (FINAL - Simplified)  
**Author:** SAI Development Team  
**Status:** ✅ Production Ready
