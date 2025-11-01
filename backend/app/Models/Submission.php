<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Submission extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'submissions';

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
        'file_path',
        'validated_at',
    ];

    protected $casts = [
        'validated_at' => 'datetime',
    ];
}
