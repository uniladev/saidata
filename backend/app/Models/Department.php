<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'departments';

    protected $fillable = [
        'faculty_id',
        'code',
        'name',
        'description',
    ];

    /**
     * Relasi ke faculty
     */
    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    /**
     * Relasi ke user profiles
     */
    public function userProfiles()
    {
        return $this->hasMany(UserProfile::class);
    }

    /**
     * Relasi ke study programs
     */
    public function studyPrograms()
    {
        return $this->hasMany(StudyProgram::class);
    }
}
