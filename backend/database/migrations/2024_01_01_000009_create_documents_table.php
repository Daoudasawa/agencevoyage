<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pelerin_id')->constrained('pelerins')->onDelete('cascade');
            $table->foreignId('type_document_id')->constrained('types_documents')->onDelete('cascade');
            $table->string('nom_fichier');
            $table->string('chemin_fichier'); // chemin relatif dans storage
            $table->enum('statut', ['soumis', 'valide', 'rejete'])->default('soumis');
            $table->text('commentaire')->nullable();
            $table->foreignId('verifie_par')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('date_verification')->nullable();
            $table->timestamps();

            $table->index(['pelerin_id', 'statut']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
