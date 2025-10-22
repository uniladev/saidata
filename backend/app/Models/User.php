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
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'remember_token',
        'refresh_token',
        'refresh_token_expires_at', // Add this
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        // Don't cast this - MongoDB handles it natively
        // 'refresh_token_expires_at' => 'datetime',
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
     * Relasi ke user profile
     */
    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    /**
     * Append profile data to user array
     */
    protected $with = ['profile'];

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