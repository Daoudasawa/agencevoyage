<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vols', function (Blueprint $table) {
            $table->id();
            $table->string('compagnie');
            $table->string('numero_vol')->unique();
            $table->dateTime('date_depart');
            $table->string('aeroport_depart')->default('OUA - Ouagadougou');
            $table->string('aeroport_arrivee')->default('JED - Jeddah');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vols');
    }
};
