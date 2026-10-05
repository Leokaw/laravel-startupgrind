<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CompanyService extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'description',
        'price',
        'category',
        'is_active'
    ];

    protected $dates = [
        'created_at',
        'updated_at'
    ];
}