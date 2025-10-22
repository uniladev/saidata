# Embedded Documents Structure - Faculty, Department, Study Program

## 📋 Overview

Struktur database telah diubah dari **relational (normalized)** menjadi **embedded documents (denormalized)** mengikuti best practice MongoDB.

### Before (Relational):
```
Collections:
- faculties (3 documents)
- departments (7 documents) with faculty_id foreign key
- study_programs (10+ documents) with department_id foreign key
- user_profiles (5 documents) with faculty_id, department_id, study_program_id
```

### After (Embedded):
```
Collections:
- faculties (3 documents with embedded departments & study_programs)
- user_profiles (5 documents with faculty_code, department_code, study_program_code)
```

---

## 🗄️ Database Structure

### Faculty Collection (faculties)

```json
{
  "_id": ObjectId("..."),
  "code": "FMIPA",
  "name": "Fakultas Matematika dan Ilmu Pengetahuan Alam",
  "dean": "Prof. Dr. Ahmad Fauzi, M.Si.",
  "description": "FMIPA Universitas Lampung",
  "departments": [
    {
      "code": "BIO",
      "name": "Biologi",
      "head": "Dr. Siti Nurhayati, M.Si.",
      "description": "Jurusan Biologi",
      "study_programs": [
        {
          "code": "BIO-S1",
          "name": "Biologi",
          "degree": "S1",
          "duration_years": 4,
          "description": "Program Studi S1 Biologi"
        },
        {
          "code": "BIO-S2",
          "name": "Biologi",
          "degree": "S2",
          "duration_years": 2,
          "description": "Program Studi S2 Biologi"
        }
      ]
    },
    {
      "code": "ILKOM",
      "name": "Ilmu Komputer",
      "head": "Dr. Budi Hartono, M.Kom.",
      "description": "Jurusan Ilmu Komputer",
      "study_programs": [
        {
          "code": "ILKOM-S1",
          "name": "Ilmu Komputer",
          "degree": "S1",
          "duration_years": 4,
          "description": "Program Studi S1 Ilmu Komputer"
        }
      ]
    }
  ],
  "created_at": "2025-10-22T...",
  "updated_at": "2025-10-22T..."
}
```

### User Profile Collection (user_profiles)

```json
{
  "_id": ObjectId("..."),
  "user_id": ObjectId("..."),
  "faculty_code": "FMIPA",
  "department_code": "BIO",
  "study_program_code": "BIO-S1",
  "student_id": "2267051001",
  "phone": "081234567890",
  "created_at": "2025-10-22T...",
  "updated_at": "2025-10-22T..."
}
```

---

## 🎨 Faculty Model (`app/Models/Faculty.php`)

### Properties

```php
protected $fillable = [
    'code',
    'name',
    'dean',
    'description',
    'departments', // Array of embedded department documents
];

protected $casts = [
    'departments' => 'array',
];
```

### Helper Methods

#### 1. Get Department by Code
```php
public function getDepartmentByCode($code)
```
**Example:**
```php
$faculty = Faculty::where('code', 'FMIPA')->first();
$department = $faculty->getDepartmentByCode('BIO');
// Returns: ['code' => 'BIO', 'name' => 'Biologi', 'head' => '...', ...]
```

#### 2. Get Study Program by Code
```php
public function getStudyProgramByCode($deptCode, $progCode)
```
**Example:**
```php
$faculty = Faculty::where('code', 'FMIPA')->first();
$program = $faculty->getStudyProgramByCode('BIO', 'BIO-S1');
// Returns: ['code' => 'BIO-S1', 'name' => 'Biologi', 'degree' => 'S1', ...]
```

#### 3. Add Department
```php
public function addDepartment(array $department)
```
**Example:**
```php
$faculty->addDepartment([
    'code' => 'GEO',
    'name' => 'Geografi',
    'head' => 'Dr. Budi, M.Sc.',
    'description' => 'Jurusan Geografi',
    'study_programs' => []
]);
```

#### 4. Add Study Program to Department
```php
public function addStudyProgram($deptCode, array $studyProgram)
```
**Example:**
```php
$faculty->addStudyProgram('BIO', [
    'code' => 'BIO-S3',
    'name' => 'Biologi',
    'degree' => 'S3',
    'duration_years' => 3,
    'description' => 'Program Doktor Biologi'
]);
```

---

## 🎨 UserProfile Model (`app/Models/UserProfile.php`)

### Properties

```php
protected $fillable = [
    'user_id',
    'faculty_code',      // String code (e.g., "FMIPA")
    'department_code',   // String code (e.g., "BIO")
    'study_program_code', // String code (e.g., "BIO-S1")
    'student_id',
    'phone',
];
```

### Accessor Attributes (Dynamic)

#### 1. Faculty Attribute
```php
$profile->faculty
```
**Returns Object:**
```php
(object) [
    'code' => 'FMIPA',
    'name' => 'Fakultas Matematika dan Ilmu Pengetahuan Alam',
    'dean' => 'Prof. Dr. Ahmad Fauzi, M.Si.',
    'description' => 'FMIPA Universitas Lampung',
]
```

#### 2. Department Attribute
```php
$profile->department
```
**Returns Object:**
```php
(object) [
    'code' => 'BIO',
    'name' => 'Biologi',
    'head' => 'Dr. Siti Nurhayati, M.Si.',
    'description' => 'Jurusan Biologi',
]
```

#### 3. Study Program Attribute
```php
$profile->studyProgram
```
**Returns Object:**
```php
(object) [
    'code' => 'BIO-S1',
    'name' => 'Biologi',
    'degree' => 'S1',
    'duration_years' => 4,
    'description' => 'Program Studi S1 Biologi',
]
```

---

## 🎨 User Model (`app/Models/User.php`)

### Appended Attributes

```php
protected $appends = ['faculty_code', 'department_code', 'study_program_code'];
```

### Usage

```php
$user = Auth::user();

// Direct access to codes (auto-appended)
echo $user->faculty_code;         // "FMIPA"
echo $user->department_code;      // "BIO"
echo $user->study_program_code;   // "BIO-S1"

// Access full data via profile
echo $user->profile->faculty->name;          // "Fakultas MIPA"
echo $user->profile->department->name;       // "Biologi"
echo $user->profile->studyProgram->degree;   // "S1"
```

---

## 🌱 UniversityDataSeeder

### Struktur Seeder

```php
Faculty::create([
    'code' => 'FMIPA',
    'name' => 'Fakultas Matematika dan Ilmu Pengetahuan Alam',
    'dean' => 'Prof. Dr. Ahmad Fauzi, M.Si.',
    'description' => 'FMIPA Universitas Lampung',
    'departments' => [
        [
            'code' => 'BIO',
            'name' => 'Biologi',
            'head' => 'Dr. Siti Nurhayati, M.Si.',
            'description' => 'Jurusan Biologi',
            'study_programs' => [
                [
                    'code' => 'BIO-S1',
                    'name' => 'Biologi',
                    'degree' => 'S1',
                    'duration_years' => 4,
                    'description' => 'Program Studi S1 Biologi'
                ]
            ]
        ]
    ]
]);

UserProfile::create([
    'user_id' => $user->id,
    'faculty_code' => 'FMIPA',
    'department_code' => 'BIO',
    'study_program_code' => 'BIO-S1',
    'student_id' => '2267051001',
    'phone' => '081234567890',
]);
```

### Run Seeder

```bash
php artisan db:seed --class=UniversityDataSeeder
```

**Output:**
```
🗑️  Cleared existing university data
✅ Faculties with embedded departments created
✅ Dummy users created

📚 Faculties Created (with embedded departments):
  - FMIPA: 5 departments (BIO, ILKOM, MAT, KIM, FIS)
  - FK: 2 departments (DOKTER, FARM)
  - FEB: 2 departments (AKUN, MAN)

👥 Dummy Users:
  1. 2267051001 / password123 - Budi Santoso (Biologi FMIPA)
  2. 2267051002 / password123 - Siti Rahma (Ilmu Komputer FMIPA)
  3. 2267011001 / password123 - Andi Wijaya (Farmasi FK)
  4. 2267051003 / password123 - Dewi Lestari (Matematika FMIPA)
  5. admin / admin123 - Administrator
```

---

## 💡 Advantages of Embedded Structure

### 1. **Performance**
✅ **Before:** 3 separate queries to get faculty → department → study program  
✅ **After:** 1 query to get all data (faculty with embedded departments & programs)

```php
// Before (Relational - 3 queries)
$faculty = Faculty::find($id);
$department = Department::find($faculty_id);
$program = StudyProgram::find($program_id);

// After (Embedded - 1 query)
$faculty = Faculty::where('code', 'FMIPA')->first();
// All departments & programs already included!
```

### 2. **Simplicity**
- No complex JOIN queries
- No foreign key management
- Data locality (related data stored together)

### 3. **Flexibility**
- Easy to add new fields to embedded documents
- No migration needed for schema changes (MongoDB is schema-less)

### 4. **Scalability**
- Better for read-heavy operations
- Reduced database round trips
- Faster menu filtering

---

## 🔄 Migration Guide (Relational → Embedded)

### Step 1: Backup Old Data
```bash
# MongoDB export (if needed)
mongoexport --db=saidata --collection=faculties --out=faculties_backup.json
mongoexport --db=saidata --collection=departments --out=departments_backup.json
mongoexport --db=saidata --collection=study_programs --out=study_programs_backup.json
```

### Step 2: Update Models
- ✅ Faculty model: Add `departments` field with array cast
- ✅ UserProfile model: Change `faculty_id` → `faculty_code`, etc.
- ✅ User model: Update accessors to use profile codes

### Step 3: Run New Seeder
```bash
php artisan db:seed --class=UniversityDataSeeder
```

### Step 4: Update Existing User Profiles
If you have existing user profiles with `faculty_id`, you need to migrate them:

```php
// Migration script example
$profiles = UserProfile::all();
foreach ($profiles as $profile) {
    $faculty = Faculty::find($profile->faculty_id);
    $department = Department::find($profile->department_id);
    $program = StudyProgram::find($profile->study_program_id);
    
    $profile->update([
        'faculty_code' => $faculty?->code,
        'department_code' => $department?->code,
        'study_program_code' => $program?->code,
    ]);
}
```

---

## 🔍 Query Examples

### Get All Faculties with Embedded Data
```php
$faculties = Faculty::all();
foreach ($faculties as $faculty) {
    echo $faculty->name . "\n";
    foreach ($faculty->departments as $dept) {
        echo "  - " . $dept['name'] . "\n";
        foreach ($dept['study_programs'] as $program) {
            echo "    * " . $program['name'] . " (" . $program['degree'] . ")\n";
        }
    }
}
```

### Find Specific Department
```php
$faculty = Faculty::where('code', 'FMIPA')->first();
$bio = $faculty->getDepartmentByCode('BIO');
echo $bio['name']; // "Biologi"
echo $bio['head']; // "Dr. Siti Nurhayati, M.Si."
```

### Get User's Faculty Info
```php
$user = User::with('profile')->find($userId);
echo $user->profile->faculty->name;         // "Fakultas MIPA"
echo $user->profile->department->name;      // "Biologi"
echo $user->profile->studyProgram->degree;  // "S1"
```

### Menu Filtering Still Works!
```php
// MenuController.php - No changes needed!
$user = Auth::user();
$menus = Menu::forUser($user)
    ->parentOnly()
    ->with('children')
    ->orderBy('order')
    ->get();

// forUser scope uses faculty_code, department_code from profile ✅
```

---

## 🐛 Troubleshooting

### Issue: Profile returns null for faculty/department
**Solution:** Check if faculty_code, department_code exist in user_profiles collection

```php
$profile = UserProfile::find($id);
dd($profile->faculty_code, $profile->department_code);
```

### Issue: Department not found
**Solution:** Make sure faculty has embedded departments array

```php
$faculty = Faculty::where('code', 'FMIPA')->first();
dd($faculty->departments); // Should be array, not null
```

### Issue: Menu not filtering correctly
**Solution:** Ensure UserProfile accessors return correct codes

```php
$user = Auth::user()->load('profile');
dd([
    'faculty_code' => $user->faculty_code,
    'department_code' => $user->department_code,
    'study_program_code' => $user->study_program_code,
]);
```

---

## 📊 Database Statistics

**Before (Relational):**
- Collections: 6 (users, user_profiles, faculties, departments, study_programs, menus)
- Total documents: 3 + 7 + 10 + 5 + 1 + 47 = 73 documents
- Queries for menu: ~4-5 queries (user → profile → faculty → department)

**After (Embedded):**
- Collections: 4 (users, user_profiles, faculties, menus)
- Total documents: 5 + 5 + 3 + 47 = 60 documents
- Queries for menu: ~2 queries (user → profile; faculty lookup cached)

**Performance Improvement:** ~50% reduction in queries! 🚀

---

**Created:** October 22, 2025  
**Last Updated:** October 22, 2025  
**Version:** 2.0.0  
**Author:** SAI Development Team
