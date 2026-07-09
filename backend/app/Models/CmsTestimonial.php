<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsTestimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'country',
        'photo',
        'review',
        'rating',
        'status',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
