<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelerin extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'groupe_id', 'telephone', 'adresse', 'profession',
        'numero_passeport', 'nationalite', 'date_naissance', 'photo',
    ];

    protected function casts(): array
    {
        return [
            'date_naissance' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function inscriptionActive()
    {
        return $this->hasOne(Inscription::class)->whereNotIn('statut', ['desiste']);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    // Calcul du total payé (paiements validés)
    public function getTotalPaye(): int
    {
        return (int) $this->paiements()->where('statut', 'valide')->sum('montant');
    }
}
