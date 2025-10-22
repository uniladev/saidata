<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class FormHistory extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'form_history';

    protected $fillable = [
        'form_id',
        'version',
        'title',
        'slug',
        'description',
        'submitText',
        'successMessage',
        'fields',
        'changed_by',
        'change_summary',
    ];

    protected $casts = [
        'fields' => 'array',
        'version' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function form()
    {
        return $this->belongsTo(Form::class, 'form_id');
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}