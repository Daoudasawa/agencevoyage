<?php

namespace Database\Seeders;

use App\Models\Groupe;
use App\Models\Hotel;
use Illuminate\Database\Seeder;

class GroupeSeeder extends Seeder
{
    public function run(): void
    {
        // Groupe Hajj Économique
        $groupe1 = Groupe::create([
            'nom' => 'Groupe Hajj Économique 2026 - A',
            'vol_id' => 1,
            'date_depart' => '2026-06-10',
            'date_retour' => '2026-07-10',
            'capacite_max' => 50,
            'notes' => 'Premier groupe Hajj économique',
        ]);
        $groupe1->hotels()->attach([1, 4]); // Dar Al Tawhid + Anwar Al Madinah

        // Groupe Hajj Confort
        $groupe2 = Groupe::create([
            'nom' => 'Groupe Hajj Confort 2026 - Premium',
            'vol_id' => 2,
            'date_depart' => '2026-06-12',
            'date_retour' => '2026-07-12',
            'capacite_max' => 30,
            'notes' => 'Groupe confort VIP',
        ]);
        $groupe2->hotels()->attach([2, 3]); // Swissotel + Oberoi

        // Groupe Omra Ramadan
        $groupe3 = Groupe::create([
            'nom' => 'Groupe Omra Ramadan 2026',
            'vol_id' => 3,
            'date_depart' => '2026-03-01',
            'date_retour' => '2026-03-16',
            'capacite_max' => 40,
        ]);
        $groupe3->hotels()->attach([5, 4]); // Al Safwah + Anwar
    }
}
