<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom', 'vol_id', 'date_depart', 'date_retour', 'capacite_max', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'date_depart' => 'date',
            'date_retour' => 'date',
            'capacite_max' => 'integer',
        ];
    }

    public function vol()
    {
        return $this->belongsTo(Vol::class);
    }

    public function hotels()
    {
        return $this->belongsToMany(Hotel::class, 'groupe_hotel');
    }

    public function pelerins()
    {
        return $this->hasMany(Pelerin::class);
    }

    public function getNombrePelerins(): int
    {
        return $this->pelerins()->count();
    }

    public function getPlacesRestantes(): int
    {
        return max(0, $this->capacite_max - $this->getNombrePelerins());
    }
}
