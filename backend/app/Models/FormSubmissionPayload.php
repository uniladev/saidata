<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormSubmissionPayload extends Model
{
    use HasFactory;

    protected $table = 'form_submission_payloads';

    protected $fillable = [
        'submission_id',
        'answers_json',
    ];

    protected $casts = [
        'answers_json' => 'array',
    ];

    public function submission()
    {
        return $this->belongsTo(FormSubmission::class, 'submission_id');
    }
}
