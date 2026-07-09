<?php

namespace Database\Seeders;

use App\Models\Hotel;
use Illuminate\Database\Seeder;

class HotelSeeder extends Seeder
{
    public function run(): void
    {
        $hotels = [
            ['nom' => 'Dar Al Tawhid Intercontinental', 'adresse' => 'Abraj Al-Bait, La Mecque', 'ville' => 'La Mecque', 'etoiles' => 5],
            ['nom' => 'Swissotel Makkah', 'adresse' => 'Abraj Al-Bait, La Mecque', 'ville' => 'La Mecque', 'etoiles' => 5],
            ['nom' => 'Oberoi Madina', 'adresse' => 'Al Haram District, Médine', 'ville' => 'Medine', 'etoiles' => 5],
            ['nom' => 'Anwar Al Madinah Moven Pick', 'adresse' => 'King Abdul Aziz, Médine', 'ville' => 'Medine', 'etoiles' => 4],
            ['nom' => 'Hotel Al Safwah Royale Orchid', 'adresse' => 'Ajyad Street, La Mecque', 'ville' => 'La Mecque', 'etoiles' => 4],
        ];

        foreach ($hotels as $hotel) {
            Hotel::create($hotel);
        }
    }
}
