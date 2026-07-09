<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forfaits', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->enum('type', ['hajj', 'omra']);
            $table->unsignedBigInteger('prix'); // en FCFA, entier
            $table->integer('duree'); // en jours
            $table->text('description')->nullable();
            $table->text('services_inclus')->nullable();
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forfaits');
    }
};
