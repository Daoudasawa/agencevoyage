<?php

namespace Tests\Feature;

use App\Models\Pelerin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_pelerin_can_register_and_get_token(): void
    {
        $response = $this->postJson('/api/register', [
            'nom' => 'Ouedraogo',
            'prenom' => 'Aminata',
            'email' => 'aminata@example.test',
            'telephone' => '+22670000000',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonPath('user.email', 'aminata@example.test')
            ->assertJsonPath('user.role', 'pelerin')
            ->assertJsonStructure(['token']);

        $this->assertDatabaseHas('users', ['email' => 'aminata@example.test', 'role' => 'pelerin']);
        $this->assertDatabaseHas('pelerins', ['telephone' => '+22670000000']);
    }

    public function test_inactive_user_cannot_login(): void
    {
        User::create([
            'nom' => 'Agent',
            'prenom' => 'Inactif',
            'email' => 'inactive@example.test',
            'password' => Hash::make('password123'),
            'role' => 'agent',
            'active' => false,
        ]);

        $this->postJson('/api/login', [
            'email' => 'inactive@example.test',
            'password' => 'password123',
        ])
            ->assertForbidden()
            ->assertJsonPath('error', 'ACCOUNT_DISABLED');
    }
}
