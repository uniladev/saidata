<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormVersion extends Model
{
    use HasFactory;

    protected $table = 'form_versions';

    protected $fillable = [
        'form_id',
        'version',
        'schema_json',
        'published_at',
        'is_active',
    ];

    protected $casts = [
        'schema_json' => 'array',
        'is_active' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
