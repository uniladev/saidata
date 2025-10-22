<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use MongoDB\Laravel\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'username',
        'name',
        'email',

        'role',
        'refresh_token',
        'refresh_token_expires_at',
        'profile', // Embedded profile document
    ];

    protected $hidden = [

        'remember_token',
        'refresh_token',
        'refresh_token_expires_at',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'profile' => 'array', // Cast profile as array (MongoDB compatible)
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'username' => $this->username,
            'role' => $this->role,
        ];
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    public function hasValidRefreshToken(): bool
    {
        return $this->refresh_token !== null 
            && $this->refresh_token_expires_at !== null
            && $this->refresh_token_expires_at->isFuture();
    }

    /**
     * Get profile attribute with default values
     */
    public function getProfileAttribute($value)
    {
        // If value is string (from database), decode it
        if (is_string($value)) {
            $value = json_decode($value, true);
        }

        if (!$value || empty($value)) {
            return (object)[
                'faculty_code' => null,
                'department_code' => null,
                'study_program_code' => null,
                'student_id' => null,
                'phone' => null,
            ];
        }

        // Convert array to object
        return (object)$value;
    }

    /**
     * Update profile data
     */
    public function updateProfile(array $profileData): bool
    {
        $allowedFields = ['faculty_code', 'department_code', 'study_program_code', 'student_id', 'phone'];
        $filteredData = array_intersect_key($profileData, array_flip($allowedFields));
        
        $currentProfile = (array)$this->profile;
        $newProfile = array_merge($currentProfile, $filteredData);
        
        return $this->update(['profile' => $newProfile]);
    }

    /**
     * Get faculty code from embedded profile
     */
    public function getFacultyCodeAttribute()
    {
        return $this->profile->faculty_code ?? null;
    }

    /**
     * Get department code from embedded profile
     */
    public function getDepartmentCodeAttribute()
    {
        return $this->profile->department_code ?? null;
    }

    /**
     * Get study program code from embedded profile
     */
    public function getStudyProgramCodeAttribute()
    {
        return $this->profile->study_program_code ?? null;
    }

    /**
     * Get faculty data from Faculty collection
     */
    public function getFacultyAttribute()
    {
        $facultyCode = $this->profile->faculty_code ?? null;
        
        if (!$facultyCode) {
            return null;
        }

        $faculty = Faculty::where('code', $facultyCode)->first();
        
        if (!$faculty) {
            return null;
        }

        return (object)[
            'code' => $faculty->code,
            'name' => $faculty->name,
        ];
    }

    /**
     * Get department data from embedded Faculty structure
     */
    public function getDepartmentAttribute()
    {
        $facultyCode = $this->profile->faculty_code ?? null;
        $departmentCode = $this->profile->department_code ?? null;
        
        if (!$facultyCode || !$departmentCode) {
            return null;
        }

        $faculty = Faculty::where('code', $facultyCode)->first();
        
        if (!$faculty) {
            return null;
        }

        $department = $faculty->getDepartmentByCode($departmentCode);
        
        if (!$department) {
            return null;
        }

        return (object)[
            'code' => $department['code'],
            'name' => $department['name'],
        ];
    }

    /**
     * Get study program data from embedded Faculty structure
     */
    public function getStudyProgramAttribute()
    {
        $facultyCode = $this->profile->faculty_code ?? null;
        $departmentCode = $this->profile->department_code ?? null;
        $studyProgramCode = $this->profile->study_program_code ?? null;
        
        if (!$facultyCode || !$departmentCode || !$studyProgramCode) {
            return null;
        }

        $faculty = Faculty::where('code', $facultyCode)->first();
        
        if (!$faculty) {
            return null;
        }

        $studyProgram = $faculty->getStudyProgramByCode($departmentCode, $studyProgramCode);
        
        if (!$studyProgram) {
            return null;
        }

        return (object)[
            'code' => $studyProgram['code'],
            'name' => $studyProgram['name'],
            'degree' => $studyProgram['degree'] ?? null,
            'duration_years' => $studyProgram['duration_years'] ?? null,
        ];
    }

    /**
     * Append attributes to model
     */
    protected $appends = ['faculty_code', 'department_code', 'study_program_code'];
}
