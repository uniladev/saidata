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
        'profile',
    ];

    protected $hidden = [
        'remember_token',
        'refresh_token',
        'refresh_token_expires_at',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'profile' => 'object',
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

    public function getProfileAttribute($value)
    {
        return $value ?? (object)[
            'faculty_id' => null,
            'department_id' => null,
            'study_program_id' => null,
            'student_id' => null,
            'phone' => null,
        ];
    }

    public function updateProfile(array $profileData): bool
    {
        $allowedFields = ['faculty_id', 'department_id', 'study_program_id', 'student_id', 'phone'];
        $filteredData = array_intersect_key($profileData, array_flip($allowedFields));
        
        return $this->update(['profile' => array_merge((array)$this->profile, $filteredData)]);
    }

    /**
     * Relasi ke fakultas menggunakan embedded faculty_id
     */
    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'profile.faculty_id');
    }

    /**
     * Relasi ke jurusan menggunakan embedded department_id
     */
    public function department()
    {
        return $this->belongsTo(Department::class, 'profile.department_id');
    }

    /**
     * Relasi ke program studi menggunakan embedded study_program_id
     */
    public function studyProgram()
    {
        return $this->belongsTo(StudyProgram::class, 'profile.study_program_id');
    }

    /**
     * REMOVE OR COMMENT OUT the $appends property
     * These attributes require database queries, so they shouldn't be auto-appended
     */
    // protected $appends = ['faculty_code', 'department_code', 'study_program_code'];

    /**
     * Get faculty code from profile - FIXED VERSION
     */
    public function getFacultyCodeAttribute()
    {
        if (!$this->profile || !isset($this->profile->faculty_id)) {
            return null;
        }
        
        $faculty = Faculty::find($this->profile->faculty_id);
        return $faculty?->code;
    }

    /**
     * Get department code from profile - FIXED VERSION
     */
    public function getDepartmentCodeAttribute()
    {
        if (!$this->profile || !isset($this->profile->department_id)) {
            return null;
        }
        
        $department = Department::find($this->profile->department_id);
        return $department?->code;
    }

    /**
     * Get study program code from profile - FIXED VERSION
     */
    public function getStudyProgramCodeAttribute()
    {
        if (!$this->profile || !isset($this->profile->study_program_id)) {
            return null;
        }
        
        $studyProgram = StudyProgram::find($this->profile->study_program_id);
        return $studyProgram?->code;
    }
}