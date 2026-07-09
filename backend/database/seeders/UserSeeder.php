<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Administrateur
        User::create([
            'nom' => 'Diallo',
            'prenom' => 'Amadou',
            'email' => 'admin@hajjomra.bf',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'active' => true,
        ]);

        // Agent
        User::create([
            'nom' => 'Ouedraogo',
            'prenom' => 'Fatima',
            'email' => 'agent@hajjomra.bf',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'active' => true,
        ]);

        // Agent 2
        User::create([
            'nom' => 'Traore',
            'prenom' => 'Ibrahim',
            'email' => 'agent2@hajjomra.bf',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'active' => true,
        ]);
    }
}
