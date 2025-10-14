<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $table = 'departments';

    protected $fillable = [
        'faculty_id',
        'code',
        'name',
        'degree_level',
    ];

    /**
     * Relasi: jurusan punya satu fakultas.
     */
    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    /**
     * Relasi: jurusan punya banyak program studi.
     */
    public function studyPrograms()
    {
        return $this->hasMany(StudyProgram::class);
    }
}
