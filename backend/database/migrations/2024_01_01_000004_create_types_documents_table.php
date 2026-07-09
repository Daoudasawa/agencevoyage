<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('types_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('forfait_id')->constrained('forfaits')->onDelete('cascade');
            $table->string('nom'); // ex: 'Copie passeport', 'Photo identité'
            $table->boolean('obligatoire')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('types_documents');
    }
};
