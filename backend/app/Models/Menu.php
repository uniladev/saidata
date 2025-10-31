<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Menu extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'menus';

    protected $fillable = [
        'name',
        'path',
        'route',
        'parent_id',
        'level',
        'type',
        'scope',
        'order',
        'faculty_code',
        'department_code',
        'form_id',
        'icon',
        'is_active',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'level' => 'integer',
        'order' => 'integer',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get parent menu
     */
    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    /**
     * Get children menus
     */
    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')->orderBy('order');
    }

    /**
     * Scope untuk filter by scope (universitas, fakultas, jurusan)
     */
    public function scopeByScope($query, $scope)
    {
        return $query->where('scope', $scope);
    }

    /**
     * Scope untuk filter by faculty
     */
    public function scopeByFaculty($query, $facultyCode)
    {
        return $query->where(function($q) use ($facultyCode) {
            $q->where('faculty_code', $facultyCode)
              ->orWhereNull('faculty_code');
        });
    }

    /**
     * Scope untuk filter by department
     */
    public function scopeByDepartment($query, $departmentCode)
    {
        return $query->where(function($q) use ($departmentCode) {
            $q->where('department_code', $departmentCode)
              ->orWhereNull('department_code');
        });
    }

    /**
     * Scope untuk filter active menus
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get all descendants (recursive children)
     */
    public function descendants()
    {
        $descendants = collect();
        
        foreach ($this->children as $child) {
            $descendants->push($child);
            $descendants = $descendants->merge($child->descendants());
        }
        
        return $descendants;
    }

    /**
     * Check if menu has children
     */
    public function hasChildren()
    {
        return $this->children()->count() > 0;
    }

    /**
     * Get breadcrumb path
     */
    public function getBreadcrumb()
    {
        $breadcrumb = collect([$this]);
        $parent = $this->parent;
        
        while ($parent) {
            $breadcrumb->prepend($parent);
            $parent = $parent->parent;
        }
        
        return $breadcrumb;
    }
}
