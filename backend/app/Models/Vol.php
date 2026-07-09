<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vol extends Model
{
    use HasFactory;

    protected $fillable = [
        'compagnie', 'numero_vol', 'date_depart', 'aeroport_depart', 'aeroport_arrivee', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'date_depart' => 'datetime',
        ];
    }

    public function groupes()
    {
        return $this->hasMany(Groupe::class);
    }
}
