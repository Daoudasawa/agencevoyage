<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nom', 'prenom', 'email', 'password', 'role', 'active',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'active' => 'boolean',
            'password' => 'hashed',
        ];
    }

    // Relations
    public function pelerin()
    {
        return $this->hasOne(Pelerin::class);
    }

    public function paiementsValides()
    {
        return $this->hasMany(Paiement::class, 'enregistre_par');
    }

    public function documentsVerifies()
    {
        return $this->hasMany(Document::class, 'verifie_par');
    }

    // Scopes
    public function scopeActif($query)
    {
        return $query->where('active', true);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isAgent(): bool
    {
        return $this->role === 'agent';
    }

    public function isPelerin(): bool
    {
        return $this->role === 'pelerin';
    }

    public function blogPosts()
    {
        return $this->hasMany(CmsBlogPost::class, 'author_id');
    }
}
