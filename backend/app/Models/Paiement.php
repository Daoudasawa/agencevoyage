<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'pelerin_id', 'inscription_id', 'enregistre_par', 'montant',
        'date_paiement', 'mode_paiement', 'reference', 'statut', 'notes', 'valide_le',
    ];

    protected function casts(): array
    {
        return [
            'date_paiement' => 'date',
            'valide_le' => 'datetime',
            'montant' => 'integer',
        ];
    }

    public function pelerin()
    {
        return $this->belongsTo(Pelerin::class);
    }

    public function inscription()
    {
        return $this->belongsTo(Inscription::class);
    }

    public function enregistrePar()
    {
        return $this->belongsTo(User::class, 'enregistre_par');
    }
}
