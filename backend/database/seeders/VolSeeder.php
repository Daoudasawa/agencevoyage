<?php

namespace Database\Seeders;

use App\Models\Vol;
use Illuminate\Database\Seeder;

class VolSeeder extends Seeder
{
    public function run(): void
    {
        $vols = [
            [
                'compagnie' => 'Ethiopian Airlines',
                'numero_vol' => 'ET-609-HAJ2026',
                'date_depart' => '2026-06-10 03:00:00',
                'aeroport_depart' => 'OUA - Ouagadougou',
                'aeroport_arrivee' => 'JED - Jeddah',
                'notes' => 'Vol groupe Hajj 2026 - Escale Addis-Abéba',
            ],
            [
                'compagnie' => 'Air Maroc',
                'numero_vol' => 'AT-501-HAJ2026',
                'date_depart' => '2026-06-12 01:30:00',
                'aeroport_depart' => 'OUA - Ouagadougou',
                'aeroport_arrivee' => 'JED - Jeddah',
                'notes' => 'Vol groupe Hajj 2026 Confort - Escale Casablanca',
            ],
            [
                'compagnie' => 'Ethiopian Airlines',
                'numero_vol' => 'ET-502-OMR2026',
                'date_depart' => '2026-03-01 22:00:00',
                'aeroport_depart' => 'OUA - Ouagadougou',
                'aeroport_arrivee' => 'JED - Jeddah',
                'notes' => 'Vol Omra Ramadan 2026',
            ],
        ];

        foreach ($vols as $vol) {
            Vol::create($vol);
        }
    }
}
