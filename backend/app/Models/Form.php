<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Form extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'forms';

    protected $fillable = [
        'title',
        'description',
        'submitText',
        'successMessage',
        'fields',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'fields' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = ['_id'];

    public function get_idAttribute()
    {
        return (string) $this->attributes['_id'];
    }

    // Make sure _id is NOT in the $hidden array
    // Remove this if it exists:
    // protected $hidden = ['_id'];

    // Add this to ensure _id is always visible
    protected $visible = [
        '_id',
        'title',
        'description',
        'submitText',
        'successMessage',
        'fields',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function submissions()
    {
        return $this->hasMany(FormSubmission::class, 'form_id');
    }
}
