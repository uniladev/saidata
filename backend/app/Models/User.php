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

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username', // NPM is the username from SSO
        'name',
        'email',
        'role',
        'refresh_token',
        'refresh_token_expires_at',
        // Embedded profile fields
        'profile',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'remember_token',
        'refresh_token',
        'refresh_token_expires_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'profile' => 'object', // Cast profile as object
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'username' => $this->username,
            'role' => $this->role,
        ];
    }

    /**
     * Check if user has a specific role
     *
     * @param string $role
     * @return bool
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user has any of the given roles
     *
     * @param array $roles
     * @return bool
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    /**
     * Check if refresh token is valid
     *
     * @return bool
     */
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
        return $value ?? (object)[
            'faculty_id' => null,
            'department_id' => null,
            'study_program_id' => null,
            'student_id' => null,
            'phone' => null,
        ];
    }

    /**
     * Update user profile data
     *
     * @param array $profileData
     * @return bool
     */
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
     * Append profile data to user array
     */
   // protected $with = ['profile'];

    /**
     * Append additional attributes
     */
    protected $appends = ['faculty_code', 'department_code', 'study_program_code'];

    /**
     * Get faculty code from profile
     */
    public function getFacultyCodeAttribute()
    {
        return $this->profile?->faculty?->code;
    }

    /**
     * Get department code from profile
     */
    public function getDepartmentCodeAttribute()
    {
        return $this->profile?->department?->code;
    }

    /**
     * Get study program code from profile
     */
    public function getStudyProgramCodeAttribute()
    {
        return $this->profile?->studyProgram?->code;
    }
}