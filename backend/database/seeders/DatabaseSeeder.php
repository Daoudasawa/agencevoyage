<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ForfaitSeeder::class,
            VolSeeder::class,
            HotelSeeder::class,
            GroupeSeeder::class,
            PelerinSeeder::class,
            CmsSeeder::class,
        ]);
    }
}
