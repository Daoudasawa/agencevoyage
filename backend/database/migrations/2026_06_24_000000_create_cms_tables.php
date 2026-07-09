<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cms_sections', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->json('content')->nullable();
            $table->string('media_url')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('cms_services', function (Blueprint $table) {
            $table->id();
            $table->string('icon')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('cms_testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('country')->default('Burkina Faso');
            $table->string('photo')->nullable();
            $table->text('review');
            $table->integer('rating')->default(5);
            $table->string('status')->default('published');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('cms_gallery', function (Blueprint $table) {
            $table->id();
            $table->string('image_path');
            $table->string('caption')->nullable();
            $table->string('category')->nullable();
            $table->string('album')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('cms_blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->text('content');
            $table->string('image')->nullable();
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->string('status')->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('cms_faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->string('category')->default('Général');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('cms_contact_info', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        Schema::create('cms_departures', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('type'); // 'hajj' ou 'omra'
            $table->foreignId('forfait_id')->nullable()->constrained('forfaits')->nullOnDelete();
            $table->integer('places_total');
            $table->integer('places_remaining');
            $table->unsignedBigInteger('price'); // FCFA (entier)
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('cms_why_choose_us', function (Blueprint $table) {
            $table->id();
            $table->string('icon')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cms_why_choose_us');
        Schema::dropIfExists('cms_departures');
        Schema::dropIfExists('cms_contact_info');
        Schema::dropIfExists('cms_faqs');
        Schema::dropIfExists('cms_blog_posts');
        Schema::dropIfExists('cms_gallery');
        Schema::dropIfExists('cms_testimonials');
        Schema::dropIfExists('cms_services');
        Schema::dropIfExists('cms_sections');
    }
};
