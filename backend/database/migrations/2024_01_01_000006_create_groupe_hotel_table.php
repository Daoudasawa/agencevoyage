<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('groupe_hotel', function (Blueprint $table) {
            $table->foreignId('groupe_id')->constrained('groupes')->onDelete('cascade');
            $table->foreignId('hotel_id')->constrained('hotels')->onDelete('cascade');
            $table->primary(['groupe_id', 'hotel_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('groupe_hotel');
    }
};
