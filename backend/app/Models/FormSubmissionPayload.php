<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class FormSubmissionPayload extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'form_submission_payloads';

    protected $fillable = [
        'submission_id',
        'answers',
        'created_at',
    ];

    protected $casts = [
        'answers' => 'array',
        'created_at' => 'datetime',
    ];

    public function submission()
    {
        return $this->belongsTo(FormSubmission::class, 'submission_id');
    }
}
