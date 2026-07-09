<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'pelerin_id', 'forfait_id', 'statut', 'commentaire_agent', 'date_inscription',
    ];

    protected function casts(): array
    {
        return [
            'date_inscription' => 'datetime',
        ];
    }

    public function pelerin()
    {
        return $this->belongsTo(Pelerin::class);
    }

    public function forfait()
    {
        return $this->belongsTo(Forfait::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    // Calcul solde restant
    public function getSoldeRestant(): int
    {
        $totalPaye = (int) $this->paiements()->where('statut', 'valide')->sum('montant');
        return max(0, $this->forfait->prix - $totalPaye);
    }
}
