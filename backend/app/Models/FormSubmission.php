<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class FormSubmission extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'form_submissions';

    protected $fillable = [
        'form_id',
        'form_version_id',
        'user_id',
        'status',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function form()
    {
        return $this->belongsTo(Form::class, 'form_id');
    }

    public function version()
    {
        return $this->belongsTo(FormVersion::class, 'form_version_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function payload()
    {
        return $this->hasOne(FormSubmissionPayload::class, 'submission_id');
    }
}
