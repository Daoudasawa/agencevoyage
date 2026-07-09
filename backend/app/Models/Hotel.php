<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom', 'adresse', 'ville', 'etoiles', 'notes',
    ];

    public function groupes()
    {
        return $this->belongsToMany(Groupe::class, 'groupe_hotel');
    }
}
