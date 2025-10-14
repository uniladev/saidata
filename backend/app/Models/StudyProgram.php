<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudyProgram extends Model
{
    use HasFactory;

    protected $table = 'study_programs';

    protected $fillable = [
        'department_id',
        'code',
        'name',
        'degree_level',  // misalnya “S1”, “S2” jika perlu
    ];

    /**
     * Relasi: program studi punya satu jurusan.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Relasi: program studi juga dapat mengakses fakultas lewat jurusan.
     */
    public function faculty()
    {
        // asumsi department ada relasi ke faculty
        return $this->department->faculty();
    }

    /**
     * Jika kamu ingin query langsung fakultas dari program studi:
     */
    public function facultyRelation()
    {
        return $this->belongsToThrough(Faculty::class, Department::class);
        // catatan: butuh package relasi lintas (mis. staudenmeir/belongs-to-through) atau join manual
    }
}
