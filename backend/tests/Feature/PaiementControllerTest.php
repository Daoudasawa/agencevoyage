<?php

namespace Tests\Feature;

use App\Models\Forfait;
use App\Models\Inscription;
use App\Models\Paiement;
use App\Models\Pelerin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PaiementControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_agent_can_validate_pending_payment(): void
    {
        $pelerinUser = User::create([
            'nom' => 'Sawadogo',
            'prenom' => 'Issa',
            'email' => 'issa@example.test',
            'password' => Hash::make('password123'),
            'role' => 'pelerin',
            'active' => true,
        ]);

        $agent = User::create([
            'nom' => 'Agent',
            'prenom' => 'Agence',
            'email' => 'agent@example.test',
            'password' => Hash::make('password123'),
            'role' => 'agent',
            'active' => true,
        ]);

        $pelerin = Pelerin::create(['user_id' => $pelerinUser->id]);
        $forfait = Forfait::create([
            'nom' => 'Hajj Standard',
            'type' => 'hajj',
            'prix' => 2000000,
            'duree' => 20,
            'actif' => true,
        ]);
        $inscription = Inscription::create([
            'pelerin_id' => $pelerin->id,
            'forfait_id' => $forfait->id,
            'statut' => 'incomplet',
            'date_inscription' => now(),
        ]);

        $paiement = Paiement::create([
            'pelerin_id' => $pelerin->id,
            'inscription_id' => $inscription->id,
            'montant' => 500000,
            'date_paiement' => now()->toDateString(),
            'mode_paiement' => 'especes',
            'reference' => 'PAY-001',
            'statut' => 'en_attente',
        ]);

        Sanctum::actingAs($agent);

        $this->putJson("/api/admin/paiements/{$paiement->id}/valider")
            ->assertOk()
            ->assertJsonPath('paiement.statut', 'valide')
            ->assertJsonPath('paiement.enregistre_par.id', $agent->id);

        $this->assertDatabaseHas('paiements', [
            'id' => $paiement->id,
            'statut' => 'valide',
            'enregistre_par' => $agent->id,
        ]);
    }

    public function test_validated_payment_cannot_be_cancelled(): void
    {
        $agent = User::create([
            'nom' => 'Agent',
            'prenom' => 'Agence',
            'email' => 'agent2@example.test',
            'password' => Hash::make('password123'),
            'role' => 'agent',
            'active' => true,
        ]);
        $pelerinUser = User::create([
            'nom' => 'Traore',
            'prenom' => 'Mariam',
            'email' => 'mariam@example.test',
            'password' => Hash::make('password123'),
            'role' => 'pelerin',
            'active' => true,
        ]);
        $pelerin = Pelerin::create(['user_id' => $pelerinUser->id]);
        $forfait = Forfait::create(['nom' => 'Omra', 'type' => 'omra', 'prix' => 1000000, 'duree' => 10, 'actif' => true]);
        $inscription = Inscription::create(['pelerin_id' => $pelerin->id, 'forfait_id' => $forfait->id, 'statut' => 'incomplet']);
        $paiement = Paiement::create([
            'pelerin_id' => $pelerin->id,
            'inscription_id' => $inscription->id,
            'montant' => 100000,
            'date_paiement' => now()->toDateString(),
            'mode_paiement' => 'virement',
            'reference' => 'PAY-002',
            'statut' => 'valide',
        ]);

        Sanctum::actingAs($agent);

        $this->putJson("/api/admin/paiements/{$paiement->id}/annuler")
            ->assertStatus(422);
    }
}
