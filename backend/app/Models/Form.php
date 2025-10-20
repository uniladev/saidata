<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Support\Str;

class Form extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'forms';

    protected $fillable = [
        'title',
        'slug',
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
        'slug',
        'description',
        'submitText',
        'successMessage',
        'fields',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($form) {
            $form->slug = $form->generateUniqueSlug($form->title);
        });

        static::updating(function ($form) {
            if ($form->isDirty('title')) {
                $form->slug = $form->generateUniqueSlug($form->title, $form->_id);
            }
        });
    }

    public function generateUniqueSlug($title, $excludeId = null)
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (
            static::where('slug', $slug)
                ->when($excludeId, fn($q) => $q->where('_id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = $originalSlug . '-' . $counter++;
        }

        return $slug;
    }

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
