<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\Inscription;
use App\Models\Forfait;
use App\Models\Paiement;
use App\Models\Pelerin;
use App\Models\TypeDocument;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PelerinSeeder extends Seeder
{
    public function run(): void
    {
        $pelerins = [
            ['nom' => 'Kabore', 'prenom' => 'Moussa', 'email' => 'moussa.kabore@example.com', 'tel' => '+22670112233', 'passeport' => 'BFA001234', 'profession' => 'Enseignant', 'forfait' => 1, 'groupe' => 1],
            ['nom' => 'Sawadogo', 'prenom' => 'Aissata', 'email' => 'aissata.sawadogo@example.com', 'tel' => '+22676223344', 'passeport' => 'BFA001235', 'profession' => 'Infirmière', 'forfait' => 1, 'groupe' => 1],
            ['nom' => 'Zongo', 'prenom' => 'Hamidou', 'email' => 'hamidou.zongo@example.com', 'tel' => '+22678334455', 'passeport' => 'BFA001236', 'profession' => 'Commerçant', 'forfait' => 2, 'groupe' => 2],
            ['nom' => 'Ouattara', 'prenom' => 'Mariam', 'email' => 'mariam.ouattara@example.com', 'tel' => '+22671445566', 'passeport' => 'BFA001237', 'profession' => 'Sage-femme', 'forfait' => 2, 'groupe' => 2],
            ['nom' => 'Toure', 'prenom' => 'Seydou', 'email' => 'seydou.toure@example.com', 'tel' => '+22675556677', 'passeport' => 'BFA001238', 'profession' => 'Agriculteur', 'forfait' => 3, 'groupe' => 3],
            ['nom' => 'Barry', 'prenom' => 'Kadiatou', 'email' => 'kadiatou.barry@example.com', 'tel' => '+22672667788', 'passeport' => 'BFA001239', 'profession' => 'Couturière', 'forfait' => 3, 'groupe' => 3],
            ['nom' => 'Diallo', 'prenom' => 'Mamadou', 'email' => 'mamadou.diallo@example.com', 'tel' => '+22677778899', 'passeport' => 'BFA001240', 'profession' => 'Médecin', 'forfait' => 1, 'groupe' => null],
            ['nom' => 'Coulibaly', 'prenom' => 'Fatoumata', 'email' => 'fatoumata.coulibaly@example.com', 'tel' => '+22673889900', 'passeport' => 'BFA001241', 'profession' => 'Avocate', 'forfait' => 4, 'groupe' => null],
            ['nom' => 'Sore', 'prenom' => 'Boureima', 'email' => 'boureima.sore@example.com', 'tel' => '+22674990011', 'passeport' => null, 'profession' => 'Étudiant', 'forfait' => 4, 'groupe' => null],
            ['nom' => 'Ilboudo', 'prenom' => 'Rasmane', 'email' => 'rasmane.ilboudo@example.com', 'tel' => '+22679001122', 'passeport' => null, 'profession' => 'Retraité', 'forfait' => 1, 'groupe' => null],
        ];

        foreach ($pelerins as $index => $data) {
            // Créer le user
            $user = User::create([
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => 'pelerin',
                'active' => true,
            ]);

            // Créer le profil pèlerin
            $pelerin = Pelerin::create([
                'user_id' => $user->id,
                'groupe_id' => $data['groupe'],
                'telephone' => $data['tel'],
                'adresse' => 'Secteur ' . ($index + 1) . ', Ouagadougou, Burkina Faso',
                'profession' => $data['profession'],
                'numero_passeport' => $data['passeport'],
                'nationalite' => 'Burkinabè',
                'date_naissance' => now()->subYears(rand(35, 70))->subDays(rand(0, 365))->toDateString(),
            ]);

            // Créer l'inscription
            $forfait = Forfait::find($data['forfait']);
            $statut = $data['groupe'] ? 'valide' : ($data['passeport'] ? 'en_verification' : 'incomplet');

            $inscription = Inscription::create([
                'pelerin_id' => $pelerin->id,
                'forfait_id' => $forfait->id,
                'statut' => $statut,
                'date_inscription' => now()->subDays(rand(10, 90)),
            ]);

            // Créer quelques paiements pour les pèlerins affectés
            if ($data['groupe']) {
                // Paiement complet pour les pèlerins validés
                Paiement::create([
                    'pelerin_id' => $pelerin->id,
                    'inscription_id' => $inscription->id,
                    'enregistre_par' => 2, // agent
                    'montant' => (int) ($forfait->prix * 0.5),
                    'date_paiement' => now()->subDays(60)->toDateString(),
                    'mode_paiement' => 'especes',
                    'reference' => 'REF-' . strtoupper(Str::random(8)),
                    'statut' => 'valide',
                    'valide_le' => now()->subDays(59),
                ]);
                Paiement::create([
                    'pelerin_id' => $pelerin->id,
                    'inscription_id' => $inscription->id,
                    'enregistre_par' => 2,
                    'montant' => (int) ($forfait->prix * 0.5),
                    'date_paiement' => now()->subDays(30)->toDateString(),
                    'mode_paiement' => 'orange_money',
                    'reference' => 'OM-' . strtoupper(Str::random(10)),
                    'statut' => 'valide',
                    'valide_le' => now()->subDays(29),
                ]);
            } elseif ($data['passeport']) {
                // Acompte partiel
                Paiement::create([
                    'pelerin_id' => $pelerin->id,
                    'inscription_id' => $inscription->id,
                    'enregistre_par' => null,
                    'montant' => (int) ($forfait->prix * 0.3),
                    'date_paiement' => now()->subDays(20)->toDateString(),
                    'mode_paiement' => 'moov_money',
                    'reference' => 'MM-' . strtoupper(Str::random(10)),
                    'statut' => 'en_attente',
                ]);
            }
        }
    }
}
