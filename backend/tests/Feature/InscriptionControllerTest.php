<?php

namespace Tests\Feature;

use App\Models\Forfait;
use App\Models\Pelerin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class InscriptionControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_pelerin_cannot_create_two_active_inscriptions(): void
    {
        $user = User::create([
            'nom' => 'Kaboré',
            'prenom' => 'Moussa',
            'email' => 'moussa@example.test',
            'password' => Hash::make('password123'),
            'role' => 'pelerin',
            'active' => true,
        ]);

        Pelerin::create(['user_id' => $user->id, 'telephone' => '+22670000001']);

        $firstForfait = Forfait::create([
            'nom' => 'Hajj Economique',
            'type' => 'hajj',
            'prix' => 2500000,
            'duree' => 21,
            'actif' => true,
        ]);

        $secondForfait = Forfait::create([
            'nom' => 'Omra Ramadan',
            'type' => 'omra',
            'prix' => 1200000,
            'duree' => 14,
            'actif' => true,
        ]);

        Sanctum::actingAs($user);

        $this->postJson('/api/inscriptions', ['forfait_id' => $firstForfait->id])
            ->assertCreated();

        $this->postJson('/api/inscriptions', ['forfait_id' => $secondForfait->id])
            ->assertStatus(422)
            ->assertJsonPath('error', 'INSCRIPTION_EXISTANTE');
    }
}
