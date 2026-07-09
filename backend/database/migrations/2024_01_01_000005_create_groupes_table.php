<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('groupes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignId('vol_id')->constrained('vols')->onDelete('restrict');
            $table->date('date_depart');
            $table->date('date_retour');
            $table->integer('capacite_max')->default(50);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('groupes');
    }
};
