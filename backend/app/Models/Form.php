<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Form extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'forms';

    protected $fillable = [
        'created_by',
        'title',
        'description',
        'password',
        'is_published',
        'current_version',
        'visibility',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'current_version' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function versions()
    {
        return $this->hasMany(FormVersion::class, 'form_id');
    }

    public function submissions()
    {
        return $this->hasMany(FormSubmission::class, 'form_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
