<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class StudyProgram extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'study_programs';

    protected $fillable = [
        'department_id',
        'code',
        'name',
        'degree', // S1, S2, S3, D3, D4
        'description',
    ];

    /**
     * Relasi ke department
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Relasi ke user profiles
     */
    public function userProfiles()
    {
        return $this->hasMany(UserProfile::class);
    }
}
