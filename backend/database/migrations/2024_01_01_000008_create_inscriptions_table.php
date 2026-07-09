<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pelerin_id')->constrained('pelerins')->onDelete('cascade');
            $table->foreignId('forfait_id')->constrained('forfaits')->onDelete('restrict');
            $table->enum('statut', ['incomplet', 'en_verification', 'valide', 'desiste'])
                  ->default('incomplet');
            $table->text('commentaire_agent')->nullable();
            $table->timestamp('date_inscription')->useCurrent();
            $table->timestamps();

            // Un pèlerin ne peut avoir qu'une seule inscription active (non désistée)
            $table->index(['pelerin_id', 'statut']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
