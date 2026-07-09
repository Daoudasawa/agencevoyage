<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pelerins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->foreignId('groupe_id')->nullable()->constrained('groupes')->onDelete('set null');
            $table->string('telephone', 20)->nullable();
            $table->text('adresse')->nullable();
            $table->string('profession')->nullable();
            $table->string('numero_passeport')->unique()->nullable();
            $table->string('nationalite')->default('Burkinabè');
            $table->date('date_naissance')->nullable();
            $table->string('photo')->nullable(); // chemin fichier photo
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pelerins');
    }
};
