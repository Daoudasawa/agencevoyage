<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsDeparture extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'type',
        'forfait_id',
        'places_total',
        'places_remaining',
        'price',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'places_total' => 'integer',
            'places_remaining' => 'integer',
            'price' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function forfait()
    {
        return $this->belongsTo(Forfait::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
