<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $table = 'user_profiles';

    /**
     * Atribut yang bisa diisi massal.
     */
    protected $fillable = [
        'user_id',
        'faculty_id',
        'department_id',
        'study_program_id',
        'student_id',
        'phone',
    ];

    /**
     * Relasi ke tabel users.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke fakultas.
     */
    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    /**
     * Relasi ke jurusan.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Relasi ke program studi.
     */
    public function studyProgram()
    {
        return $this->belongsTo(StudyProgram::class);
    }
}
