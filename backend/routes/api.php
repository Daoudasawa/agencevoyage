<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Plateforme Hajj & Omra BF
|--------------------------------------------------------------------------
*/

// ─── Routes publiques ─────────────────────────────────────────────────────
Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);

// ─── Ping (test santé API) ────────────────────────────────────────────────
Route::get('/ping', fn () => response()->json(['status' => 'ok', 'app' => config('app.name')]));

// ─── Routes publiques CMS ─────────────────────────────────────────────────
Route::get('/homepage', [\App\Http\Controllers\Api\CmsController::class, 'homepage']);
Route::get('/packages', [\App\Http\Controllers\Api\CmsController::class, 'packages']);
Route::get('/departures', [\App\Http\Controllers\Api\CmsController::class, 'departures']);
Route::get('/testimonials', [\App\Http\Controllers\Api\CmsController::class, 'testimonials']);
Route::get('/gallery', [\App\Http\Controllers\Api\CmsController::class, 'gallery']);
Route::get('/blog', [\App\Http\Controllers\Api\CmsController::class, 'blog']);
Route::get('/faqs', [\App\Http\Controllers\Api\CmsController::class, 'faqs']);
Route::get('/contact', [\App\Http\Controllers\Api\CmsController::class, 'contact']);

// ─── Routes authentifiées ─────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/user', [\App\Http\Controllers\Api\AuthController::class, 'me']);

    // Forfaits (lecture pour tous, écriture admin seulement)
    Route::get('/forfaits', [\App\Http\Controllers\Api\ForfaitController::class, 'index']);
    Route::get('/forfaits/{forfait}', [\App\Http\Controllers\Api\ForfaitController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/forfaits', [\App\Http\Controllers\Api\ForfaitController::class, 'store']);
        Route::put('/forfaits/{forfait}', [\App\Http\Controllers\Api\ForfaitController::class, 'update']);
        Route::delete('/forfaits/{forfait}', [\App\Http\Controllers\Api\ForfaitController::class, 'destroy']);
        // Types de documents par forfait
        Route::post('/forfaits/{forfait}/types-documents', [\App\Http\Controllers\Api\TypeDocumentController::class, 'store']);
        Route::put('/types-documents/{typeDocument}', [\App\Http\Controllers\Api\TypeDocumentController::class, 'update']);
        Route::delete('/types-documents/{typeDocument}', [\App\Http\Controllers\Api\TypeDocumentController::class, 'destroy']);
    });

    // ─── Espace Pèlerin ───────────────────────────────────────────────────
    Route::middleware('role:pelerin')->group(function () {
        // Inscription
        Route::post('/inscriptions', [\App\Http\Controllers\Api\InscriptionController::class, 'store']);
        Route::get('/inscriptions/mon-dossier', [\App\Http\Controllers\Api\InscriptionController::class, 'monDossier']);

        // Documents
        Route::get('/documents', [\App\Http\Controllers\Api\DocumentController::class, 'index']);
        Route::post('/documents', [\App\Http\Controllers\Api\DocumentController::class, 'store']);
        Route::get('/documents/{document}/download', [\App\Http\Controllers\Api\DocumentController::class, 'download']);

        // Paiements
        Route::get('/paiements', [\App\Http\Controllers\Api\PaiementController::class, 'index']);
        Route::post('/paiements', [\App\Http\Controllers\Api\PaiementController::class, 'store']);
        Route::get('/paiements/{paiement}/recu', [\App\Http\Controllers\Api\PdfController::class, 'recu']);
    });

    // ─── Espace Agent + Admin ─────────────────────────────────────────────
    Route::middleware('role:agent,admin')->group(function () {
        // Pèlerins
        Route::get('/admin/pelerins', [\App\Http\Controllers\Api\PelerinController::class, 'index']);
        Route::get('/admin/pelerins/{pelerin}', [\App\Http\Controllers\Api\PelerinController::class, 'show']);
        Route::post('/admin/pelerins', [\App\Http\Controllers\Api\PelerinController::class, 'store']);
        Route::put('/admin/pelerins/{pelerin}', [\App\Http\Controllers\Api\PelerinController::class, 'update']);

        // Inscriptions
        Route::get('/admin/inscriptions', [\App\Http\Controllers\Api\InscriptionController::class, 'index']);
        Route::get('/admin/inscriptions/{inscription}', [\App\Http\Controllers\Api\InscriptionController::class, 'show']);
        Route::put('/admin/inscriptions/{inscription}/statut', [\App\Http\Controllers\Api\InscriptionController::class, 'updateStatut']);

        // Documents — vérification
        Route::get('/admin/documents', [\App\Http\Controllers\Api\DocumentController::class, 'adminIndex']);
        Route::post('/admin/documents/{document}/verifier', [\App\Http\Controllers\Api\DocumentController::class, 'verifier']);
        Route::get('/admin/documents/{document}/download', [\App\Http\Controllers\Api\DocumentController::class, 'adminDownload']);

        // Paiements — validation
        Route::get('/admin/paiements', [\App\Http\Controllers\Api\PaiementController::class, 'adminIndex']);
        Route::put('/admin/paiements/{paiement}/valider', [\App\Http\Controllers\Api\PaiementController::class, 'valider']);
        Route::put('/admin/paiements/{paiement}/annuler', [\App\Http\Controllers\Api\PaiementController::class, 'annuler']);

        // Groupes
        Route::get('/admin/groupes', [\App\Http\Controllers\Api\GroupeController::class, 'index']);
        Route::get('/admin/groupes/{groupe}', [\App\Http\Controllers\Api\GroupeController::class, 'show']);
        Route::post('/admin/groupes', [\App\Http\Controllers\Api\GroupeController::class, 'store']);
        Route::put('/admin/groupes/{groupe}', [\App\Http\Controllers\Api\GroupeController::class, 'update']);
        Route::post('/admin/groupes/{groupe}/ajouter-pelerin', [\App\Http\Controllers\Api\GroupeController::class, 'ajouterPelerin']);
        Route::delete('/admin/groupes/{groupe}/retirer-pelerin/{pelerin}', [\App\Http\Controllers\Api\GroupeController::class, 'retirerPelerin']);
        Route::get('/admin/groupes/{groupe}/liste', [\App\Http\Controllers\Api\GroupeController::class, 'liste']);

        // PDF
        Route::get('/admin/pelerins/{pelerin}/fiche-pdf', [\App\Http\Controllers\Api\PdfController::class, 'fichePelerin']);
        Route::get('/admin/groupes/{groupe}/emargement', [\App\Http\Controllers\Api\PdfController::class, 'listeEmargement']);

        // Export
        Route::get('/admin/export/pelerins', [\App\Http\Controllers\Api\ExportController::class, 'pelerins']);
        Route::get('/admin/export/paiements', [\App\Http\Controllers\Api\ExportController::class, 'paiements']);

        // Vols & Hôtels
        Route::apiResource('/admin/vols', \App\Http\Controllers\Api\VolController::class);
        Route::apiResource('/admin/hotels', \App\Http\Controllers\Api\HotelController::class);
    });

    // ─── Espace Admin uniquement ─────────────────────────────────────────
    Route::middleware('role:admin')->group(function () {
        // Utilisateurs
        Route::get('/admin/utilisateurs', [\App\Http\Controllers\Api\UserController::class, 'index']);
        Route::post('/admin/utilisateurs', [\App\Http\Controllers\Api\UserController::class, 'store']);
        Route::put('/admin/utilisateurs/{user}', [\App\Http\Controllers\Api\UserController::class, 'update']);
        Route::delete('/admin/utilisateurs/{user}', [\App\Http\Controllers\Api\UserController::class, 'destroy']);
        Route::put('/admin/utilisateurs/{user}/toggle-active', [\App\Http\Controllers\Api\UserController::class, 'toggleActive']);

        // Statistiques
        Route::get('/admin/statistiques', [\App\Http\Controllers\Api\StatistiqueController::class, 'index']);

        // Gestion CMS Admin
        Route::get('/admin/cms/sections', [\App\Http\Controllers\Api\CmsAdminController::class, 'indexSections']);
        Route::post('/admin/cms/sections', [\App\Http\Controllers\Api\CmsAdminController::class, 'storeSection']);
        Route::get('/admin/cms/sections/{section}', [\App\Http\Controllers\Api\CmsAdminController::class, 'showSection']);
        Route::put('/admin/cms/sections/{section}', [\App\Http\Controllers\Api\CmsAdminController::class, 'updateSection']);
        Route::delete('/admin/cms/sections/{section}', [\App\Http\Controllers\Api\CmsAdminController::class, 'destroySection']);

        Route::get('/admin/cms/services', [\App\Http\Controllers\Api\CmsAdminController::class, 'indexServices']);
        Route::post('/admin/cms/services', [\App\Http\Controllers\Api\CmsAdminController::class, 'storeService']);
        Route::get('/admin/cms/services/{service}', [\App\Http\Controllers\Api\CmsAdminController::class, 'showService']);
        Route::put('/admin/cms/services/{service}', [\App\Http\Controllers\Api\CmsAdminController::class, 'updateService']);
        Route::delete('/admin/cms/services/{service}', [\App\Http\Controllers\Api\CmsAdminController::class, 'destroyService']);

        Route::get('/admin/cms/testimonials', [\App\Http\Controllers\Api\CmsAdminController::class, 'indexTestimonials']);
        Route::post('/admin/cms/testimonials', [\App\Http\Controllers\Api\CmsAdminController::class, 'storeTestimonial']);
        Route::get('/admin/cms/testimonials/{testimonial}', [\App\Http\Controllers\Api\CmsAdminController::class, 'showTestimonial']);
        Route::put('/admin/cms/testimonials/{testimonial}', [\App\Http\Controllers\Api\CmsAdminController::class, 'updateTestimonial']);
        Route::delete('/admin/cms/testimonials/{testimonial}', [\App\Http\Controllers\Api\CmsAdminController::class, 'destroyTestimonial']);

        Route::get('/admin/cms/gallery', [\App\Http\Controllers\Api\CmsAdminController::class, 'indexGallery']);
        Route::post('/admin/cms/gallery', [\App\Http\Controllers\Api\CmsAdminController::class, 'storeGallery']);
        Route::get('/admin/cms/gallery/{gallery}', [\App\Http\Controllers\Api\CmsAdminController::class, 'showGallery']);
        Route::put('/admin/cms/gallery/{gallery}', [\App\Http\Controllers\Api\CmsAdminController::class, 'updateGallery']);
        Route::delete('/admin/cms/gallery/{gallery}', [\App\Http\Controllers\Api\CmsAdminController::class, 'destroyGallery']);

        Route::get('/admin/cms/blog-posts', [\App\Http\Controllers\Api\CmsAdminController::class, 'indexBlogPosts']);
        Route::post('/admin/cms/blog-posts', [\App\Http\Controllers\Api\CmsAdminController::class, 'storeBlogPost']);
        Route::get('/admin/cms/blog-posts/{post}', [\App\Http\Controllers\Api\CmsAdminController::class, 'showBlogPost']);
        Route::put('/admin/cms/blog-posts/{post}', [\App\Http\Controllers\Api\CmsAdminController::class, 'updateBlogPost']);
        Route::delete('/admin/cms/blog-posts/{post}', [\App\Http\Controllers\Api\CmsAdminController::class, 'destroyBlogPost']);

        Route::get('/admin/cms/faqs', [\App\Http\Controllers\Api\CmsAdminController::class, 'indexFaqs']);
        Route::post('/admin/cms/faqs', [\App\Http\Controllers\Api\CmsAdminController::class, 'storeFaq']);
        Route::get('/admin/cms/faqs/{faq}', [\App\Http\Controllers\Api\CmsAdminController::class, 'showFaq']);
        Route::put('/admin/cms/faqs/{faq}', [\App\Http\Controllers\Api\CmsAdminController::class, 'updateFaq']);
        Route::delete('/admin/cms/faqs/{faq}', [\App\Http\Controllers\Api\CmsAdminController::class, 'destroyFaq']);

        Route::get('/admin/cms/contact', [\App\Http\Controllers\Api\CmsAdminController::class, 'indexContact']);
        Route::post('/admin/cms/contact', [\App\Http\Controllers\Api\CmsAdminController::class, 'storeContact']);
        Route::get('/admin/cms/contact/{contact}', [\App\Http\Controllers\Api\CmsAdminController::class, 'showContact']);
        Route::put('/admin/cms/contact/{contact}', [\App\Http\Controllers\Api\CmsAdminController::class, 'updateContact']);
        Route::delete('/admin/cms/contact/{contact}', [\App\Http\Controllers\Api\CmsAdminController::class, 'destroyContact']);
        Route::put('/admin/cms/contact-bulk', [\App\Http\Controllers\Api\CmsAdminController::class, 'updateBulkContact']);

        Route::get('/admin/cms/departures', [\App\Http\Controllers\Api\CmsAdminController::class, 'indexDepartures']);
        Route::post('/admin/cms/departures', [\App\Http\Controllers\Api\CmsAdminController::class, 'storeDeparture']);
        Route::get('/admin/cms/departures/{departure}', [\App\Http\Controllers\Api\CmsAdminController::class, 'showDeparture']);
        Route::put('/admin/cms/departures/{departure}', [\App\Http\Controllers\Api\CmsAdminController::class, 'updateDeparture']);
        Route::delete('/admin/cms/departures/{departure}', [\App\Http\Controllers\Api\CmsAdminController::class, 'destroyDeparture']);

        Route::get('/admin/cms/why-choose-us', [\App\Http\Controllers\Api\CmsAdminController::class, 'indexWhyChooseUs']);
        Route::post('/admin/cms/why-choose-us', [\App\Http\Controllers\Api\CmsAdminController::class, 'storeWhyChooseUs']);
        Route::get('/admin/cms/why-choose-us/{whyChooseUs}', [\App\Http\Controllers\Api\CmsAdminController::class, 'showWhyChooseUs']);
        Route::put('/admin/cms/why-choose-us/{whyChooseUs}', [\App\Http\Controllers\Api\CmsAdminController::class, 'updateWhyChooseUs']);
        Route::delete('/admin/cms/why-choose-us/{whyChooseUs}', [\App\Http\Controllers\Api\CmsAdminController::class, 'destroyWhyChooseUs']);
    });
});
