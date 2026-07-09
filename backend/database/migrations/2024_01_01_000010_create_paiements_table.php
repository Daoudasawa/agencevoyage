<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pelerin_id')->constrained('pelerins')->onDelete('cascade');
            $table->foreignId('inscription_id')->constrained('inscriptions')->onDelete('cascade');
            $table->foreignId('enregistre_par')->nullable()->constrained('users')->onDelete('set null');
            $table->unsignedBigInteger('montant'); // en FCFA
            $table->date('date_paiement');
            $table->enum('mode_paiement', ['especes', 'orange_money', 'moov_money', 'virement']);
            $table->string('reference')->unique()->nullable();
            $table->enum('statut', ['en_attente', 'valide', 'annule'])->default('en_attente');
            $table->text('notes')->nullable();
            $table->timestamp('valide_le')->nullable();
            $table->timestamps();

            $table->index(['pelerin_id', 'statut']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
