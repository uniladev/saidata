<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'faculties';

    protected $fillable = [
        'code',
        'name',
        'description',
    ];

    /**
     * Relasi ke user profiles
     */
    public function userProfiles()
    {
        return $this->hasMany(UserProfile::class);
    }

    /**
     * Relasi ke departments
     */
    public function departments()
    {
        return $this->hasMany(Department::class);
    }
}
