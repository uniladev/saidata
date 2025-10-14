<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model
{
    use HasFactory;

    protected $table = 'form_submissions';

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
        return $this->belongsTo(Form::class);
    }

    public function version()
    {
        return $this->belongsTo(FormVersion::class, 'form_version_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payload()
    {
        return $this->hasOne(FormSubmissionPayload::class, 'submission_id');
    }
}
