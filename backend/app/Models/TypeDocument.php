<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeDocument extends Model
{
    use HasFactory;

    protected $table = 'types_documents';

    protected $fillable = [
        'forfait_id', 'nom', 'obligatoire', 'description',
    ];

    protected function casts(): array
    {
        return [
            'obligatoire' => 'boolean',
        ];
    }

    public function forfait()
    {
        return $this->belongsTo(Forfait::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
