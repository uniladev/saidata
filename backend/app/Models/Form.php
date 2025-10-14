<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasFactory;

    protected $table = 'forms';

    protected $fillable = [
        'title',
        'description',
        'created_by',
        'is_published',
        'current_version',
        'visibility',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function versions()
    {
        return $this->hasMany(FormVersion::class);
    }

    public function activeVersion()
    {
        return $this->hasOne(FormVersion::class)
            ->where('is_active', true);
    }

    public function submissions()
    {
        return $this->hasMany(FormSubmission::class);
    }
}
