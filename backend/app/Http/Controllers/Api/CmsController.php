<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsSection;
use App\Models\CmsService;
use App\Models\CmsTestimonial;
use App\Models\CmsGallery;
use App\Models\CmsBlogPost;
use App\Models\CmsFaq;
use App\Models\CmsContactInfo;
use App\Models\CmsDeparture;
use App\Models\CmsWhyChooseUs;
use App\Models\Forfait;
use Illuminate\Http\JsonResponse;

class CmsController extends Controller
{
    /**
     * Retourne les données structurées pour la page d'accueil.
     */
    public function homepage(): JsonResponse
    {
        $sections = CmsSection::active()->orderBy('sort_order')->get();
        $services = CmsService::active()->orderBy('sort_order')->get();
        $whyChooseUs = CmsWhyChooseUs::active()->orderBy('sort_order')->get();
        $contact = CmsContactInfo::pluck('value', 'key');
        $testimonials = CmsTestimonial::published()->orderBy('sort_order')->get();
        $featuredOffers = Forfait::where('actif', true)->take(3)->get();
        $departures = CmsDeparture::active()->with('forfait')->orderBy('date')->get();

        return response()->json([
            'sections' => $sections,
            'services' => $services,
            'why_choose_us' => $whyChooseUs,
            'contact' => $contact,
            'testimonials' => $testimonials,
            'featured_offers' => $featuredOffers,
            'departures' => $departures,
        ]);
    }

    /**
     * Retourne les forfaits actifs avec leurs types de documents.
     */
    public function packages(): JsonResponse
    {
        $packages = Forfait::where('actif', true)->with('typesDocuments')->get();
        return response()->json($packages);
    }

    /**
     * Retourne les départs actifs.
     */
    public function departures(): JsonResponse
    {
        $departures = CmsDeparture::active()->with('forfait')->orderBy('date')->get();
        return response()->json($departures);
    }

    /**
     * Retourne les témoignages publiés.
     */
    public function testimonials(): JsonResponse
    {
        $testimonials = CmsTestimonial::published()->orderBy('sort_order')->get();
        return response()->json($testimonials);
    }

    /**
     * Retourne les images de la galerie actives.
     */
    public function gallery(): JsonResponse
    {
        $gallery = CmsGallery::active()->orderBy('sort_order')->get();
        return response()->json($gallery);
    }

    /**
     * Retourne les articles de blog publiés.
     */
    public function blog(): JsonResponse
    {
        $posts = CmsBlogPost::published()
            ->with(['author:id,nom,prenom'])
            ->orderBy('published_at', 'desc')
            ->get();
        return response()->json($posts);
    }

    /**
     * Retourne les FAQs actives regroupées par catégorie.
     */
    public function faqs(): JsonResponse
    {
        $faqs = CmsFaq::active()
            ->orderBy('sort_order')
            ->get()
            ->groupBy('category');
        return response()->json($faqs);
    }

    /**
     * Retourne les informations de contact.
     */
    public function contact(): JsonResponse
    {
        $contact = CmsContactInfo::pluck('value', 'key');
        return response()->json($contact);
    }
}
