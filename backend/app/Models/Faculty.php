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
        'departments', // Array of embedded department documents
    ];

    protected $casts = [
        'departments' => 'array',
    ];

    /**
     * Get department by code from embedded array
     */
    public function getDepartmentByCode($code)
    {
        if (!$this->departments) {
            return null;
        }

        foreach ($this->departments as $dept) {
            if ($dept['code'] === $code) {
                return $dept;
            }
        }

        return null;
    }

    /**
     * Get study program by code from embedded structure
     */
    public function getStudyProgramByCode($deptCode, $progCode)
    {
        $department = $this->getDepartmentByCode($deptCode);
        
        if (!$department || !isset($department['study_programs'])) {
            return null;
        }

        foreach ($department['study_programs'] as $program) {
            if ($program['code'] === $progCode) {
                return $program;
            }
        }

        return null;
    }
}
