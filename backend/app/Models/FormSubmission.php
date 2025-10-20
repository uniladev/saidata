<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class FormSubmission extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'form_submissions';

    protected $fillable = [
        'form_id',
        'form_version', // Just the version number
        'form_title',   // Snapshot of title (useful for display)
        'submitted_by',
        'status',
    ];

    protected $casts = [
        'form_version' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function form()
    {
        return $this->belongsTo(Form::class, 'form_id');
    }

    public function submitter()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function payload()
    {
        return $this->hasOne(FormSubmissionPayload::class, 'submission_id');
    }
}
