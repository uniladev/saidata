<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class FormSubmission extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'form_submissions';

    protected $fillable = [
        'form_id',
        'form_version', // Snapshot of the version number
        'form_title',   // Snapshot of title (useful for display)
        'submitted_by',
        'status',
        'validated_by',
        'validated_at',
        'output_url',
        'metadata',
    ];

    protected $casts = [
        'form_version' => 'integer',
        'validated_at' => 'datetime',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'pending',
    ];

    // Append virtual attributes (computed dynamically)
    protected $appends = ['_id', 'form_type', 'has_output'];

    public function get_idAttribute()
    {
        return (string) $this->attributes['_id'];
    }

    /* ------------------------
       🔹 RELATIONSHIPS
    -------------------------*/

    public function form()
    {
        return $this->belongsTo(Form::class, 'form_id');
    }

    public function submitter()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    public function payload()
    {
        return $this->hasOne(FormSubmissionPayload::class, 'submission_id');
    }

    /* ------------------------
       🔹 AUTO-INFERRED ATTRIBUTES
    -------------------------*/

    public function getFormTypeAttribute()
    {
        return $this->form ? $this->form->type : null;
    }

    public function getHasOutputAttribute()
    {
        return $this->form ? $this->form->has_output : false;
    }

    /* ------------------------
       🔹 HELPER METHODS
    -------------------------*/

    public function isService(): bool
    {
        return $this->form_type === 'service';
    }

    public function isRecord(): bool
    {
        return $this->form_type === 'record';
    }

    public function isValidated(): bool
    {
        return !is_null($this->validated_at);
    }

    /* ------------------------
       🔹 STATUS & VALIDATION LIFECYCLE
    -------------------------*/

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($submission) {
            $submission->status = 'pending';
        });

        static::updating(function ($submission) {
            if ($submission->isDirty('validated_by') && !$submission->validated_at) {
                $submission->validated_at = now();
                $submission->status = 'validated';
            }
        });
    }
}
