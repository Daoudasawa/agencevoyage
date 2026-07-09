<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Forfait extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom', 'type', 'prix', 'duree', 'description', 'services_inclus', 'actif',
    ];

    protected function casts(): array
    {
        return [
            'actif' => 'boolean',
            'prix' => 'integer',
            'duree' => 'integer',
        ];
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function typesDocuments()
    {
        return $this->hasMany(TypeDocument::class);
    }

    public function scopeActif($query)
    {
        return $query->where('actif', true);
    }

    public function departures()
    {
        return $this->hasMany(CmsDeparture::class);
    }
}
