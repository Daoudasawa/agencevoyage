<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'pelerin_id', 'type_document_id', 'nom_fichier', 'chemin_fichier',
        'statut', 'commentaire', 'verifie_par', 'date_verification',
    ];

    protected function casts(): array
    {
        return [
            'date_verification' => 'datetime',
        ];
    }

    public function pelerin()
    {
        return $this->belongsTo(Pelerin::class);
    }

    public function typeDocument()
    {
        return $this->belongsTo(TypeDocument::class, 'type_document_id');
    }

    public function verifieParUser()
    {
        return $this->belongsTo(User::class, 'verifie_par');
    }
}
