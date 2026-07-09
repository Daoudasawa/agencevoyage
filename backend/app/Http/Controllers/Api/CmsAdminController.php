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
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class CmsAdminController extends Controller
{
    // ==========================================
    // 1. SECTIONS CMS
    // ==========================================

    public function indexSections(): JsonResponse
    {
        return response()->json(CmsSection::orderBy('sort_order')->get());
    }

    public function storeSection(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|unique:cms_sections,key',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'content' => 'nullable|array',
            'media_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $section = CmsSection::create($validated);
        return response()->json($section, 201);
    }

    public function showSection(CmsSection $section): JsonResponse
    {
        return response()->json($section);
    }

    public function updateSection(Request $request, CmsSection $section): JsonResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|unique:cms_sections,key,' . $section->id,
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'content' => 'nullable|array',
            'media_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $section->update($validated);
        return response()->json($section);
    }

    public function destroySection(CmsSection $section): JsonResponse
    {
        $section->delete();
        return response()->json(['message' => 'Section supprimée avec succès.']);
    }

    // ==========================================
    // 2. SERVICES CMS
    // ==========================================

    public function indexServices(): JsonResponse
    {
        return response()->json(CmsService::orderBy('sort_order')->get());
    }

    public function storeService(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'icon' => 'nullable|string|max:100',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $service = CmsService::create($validated);
        return response()->json($service, 201);
    }

    public function showService(CmsService $service): JsonResponse
    {
        return response()->json($service);
    }

    public function updateService(Request $request, CmsService $service): JsonResponse
    {
        $validated = $request->validate([
            'icon' => 'nullable|string|max:100',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $service->update($validated);
        return response()->json($service);
    }

    public function destroyService(CmsService $service): JsonResponse
    {
        $service->delete();
        return response()->json(['message' => 'Service supprimé avec succès.']);
    }

    // ==========================================
    // 3. TÉMOIGNAGES
    // ==========================================

    public function indexTestimonials(): JsonResponse
    {
        return response()->json(CmsTestimonial::orderBy('sort_order')->get());
    }

    public function storeTestimonial(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'country' => 'nullable|string|max:255',
            'photo' => 'nullable|string|max:255',
            'review' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'status' => 'required|string|in:pending,published',
            'sort_order' => 'nullable|integer',
        ]);

        $testimonial = CmsTestimonial::create($validated);
        return response()->json($testimonial, 201);
    }

    public function showTestimonial(CmsTestimonial $testimonial): JsonResponse
    {
        return response()->json($testimonial);
    }

    public function updateTestimonial(Request $request, CmsTestimonial $testimonial): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'country' => 'nullable|string|max:255',
            'photo' => 'nullable|string|max:255',
            'review' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'status' => 'required|string|in:pending,published',
            'sort_order' => 'nullable|integer',
        ]);

        $testimonial->update($validated);
        return response()->json($testimonial);
    }

    public function destroyTestimonial(CmsTestimonial $testimonial): JsonResponse
    {
        $testimonial->delete();
        return response()->json(['message' => 'Témoignage supprimé avec succès.']);
    }

    // ==========================================
    // 4. GALERIE
    // ==========================================

    public function indexGallery(): JsonResponse
    {
        return response()->json(CmsGallery::orderBy('sort_order')->get());
    }

    public function storeGallery(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image_path' => 'required|string|max:255',
            'caption' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'album' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $gallery = CmsGallery::create($validated);
        return response()->json($gallery, 201);
    }

    public function showGallery(CmsGallery $gallery): JsonResponse
    {
        return response()->json($gallery);
    }

    public function updateGallery(Request $request, CmsGallery $gallery): JsonResponse
    {
        $validated = $request->validate([
            'image_path' => 'required|string|max:255',
            'caption' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'album' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $gallery->update($validated);
        return response()->json($gallery);
    }

    public function destroyGallery(CmsGallery $gallery): JsonResponse
    {
        $gallery->delete();
        return response()->json(['message' => 'Image de galerie supprimée avec succès.']);
    }

    // ==========================================
    // 5. BLOG POSTS
    // ==========================================

    public function indexBlogPosts(): JsonResponse
    {
        return response()->json(CmsBlogPost::with('author:id,nom,prenom')->orderBy('created_at', 'desc')->get());
    }

    public function storeBlogPost(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:cms_blog_posts,slug',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'image' => 'nullable|string|max:255',
            'status' => 'required|string|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        // Assigner l'auteur connecté si non spécifié, sinon requis
        $validated['author_id'] = $request->user()->id;

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . uniqid();
        }

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post = CmsBlogPost::create($validated);
        return response()->json($post->load('author:id,nom,prenom'), 201);
    }

    public function showBlogPost(CmsBlogPost $post): JsonResponse
    {
        return response()->json($post->load('author:id,nom,prenom'));
    }

    public function updateBlogPost(Request $request, CmsBlogPost $post): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:cms_blog_posts,slug,' . $post->id,
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'image' => 'nullable|string|max:255',
            'status' => 'required|string|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = $post->published_at ?? now();
        }

        $post->update($validated);
        return response()->json($post->load('author:id,nom,prenom'));
    }

    public function destroyBlogPost(CmsBlogPost $post): JsonResponse
    {
        $post->delete();
        return response()->json(['message' => 'Article supprimé avec succès.']);
    }

    // ==========================================
    // 6. FAQS CMS
    // ==========================================

    public function indexFaqs(): JsonResponse
    {
        return response()->json(CmsFaq::orderBy('sort_order')->get());
    }

    public function storeFaq(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'category' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $faq = CmsFaq::create($validated);
        return response()->json($faq, 201);
    }

    public function showFaq(CmsFaq $faq): JsonResponse
    {
        return response()->json($faq);
    }

    public function updateFaq(Request $request, CmsFaq $faq): JsonResponse
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'category' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $faq->update($validated);
        return response()->json($faq);
    }

    public function destroyFaq(CmsFaq $faq): JsonResponse
    {
        $faq->delete();
        return response()->json(['message' => 'FAQ supprimée avec succès.']);
    }

    // ==========================================
    // 7. INFOS DE CONTACT
    // ==========================================

    public function indexContact(): JsonResponse
    {
        return response()->json(CmsContactInfo::all());
    }

    public function storeContact(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|unique:cms_contact_info,key',
            'value' => 'nullable|string',
        ]);

        $contact = CmsContactInfo::create($validated);
        return response()->json($contact, 201);
    }

    public function showContact(CmsContactInfo $contact): JsonResponse
    {
        return response()->json($contact);
    }

    public function updateContact(Request $request, CmsContactInfo $contact): JsonResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|unique:cms_contact_info,key,' . $contact->id,
            'value' => 'nullable|string',
        ]);

        $contact->update($validated);
        return response()->json($contact);
    }

    public function destroyContact(CmsContactInfo $contact): JsonResponse
    {
        $contact->delete();
        return response()->json(['message' => 'Info de contact supprimée avec succès.']);
    }

    public function updateBulkContact(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'contacts' => 'required|array',
            'contacts.*.key' => 'required|string',
            'contacts.*.value' => 'nullable|string',
        ]);

        foreach ($validated['contacts'] as $contactData) {
            CmsContactInfo::updateOrCreate(
                ['key' => $contactData['key']],
                ['value' => $contactData['value']]
            );
        }

        return response()->json([
            'message' => 'Contacts mis à jour avec succès.',
            'contacts' => CmsContactInfo::all()
        ]);
    }

    // ==========================================
    // 8. DEPARTS / DEPARTURES
    // ==========================================

    public function indexDepartures(): JsonResponse
    {
        return response()->json(CmsDeparture::with('forfait')->orderBy('date')->get());
    }

    public function storeDeparture(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|string|in:hajj,omra',
            'forfait_id' => 'nullable|exists:forfaits,id',
            'places_total' => 'required|integer|min:0',
            'places_remaining' => 'required|integer|min:0|lte:places_total',
            'price' => 'required|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $departure = CmsDeparture::create($validated);
        return response()->json($departure->load('forfait'), 201);
    }

    public function showDeparture(CmsDeparture $departure): JsonResponse
    {
        return response()->json($departure->load('forfait'));
    }

    public function updateDeparture(Request $request, CmsDeparture $departure): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|string|in:hajj,omra',
            'forfait_id' => 'nullable|exists:forfaits,id',
            'places_total' => 'required|integer|min:0',
            'places_remaining' => 'required|integer|min:0|lte:places_total',
            'price' => 'required|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $departure->update($validated);
        return response()->json($departure->load('forfait'));
    }

    public function destroyDeparture(CmsDeparture $departure): JsonResponse
    {
        $departure->delete();
        return response()->json(['message' => 'Départ supprimé avec succès.']);
    }

    // ==========================================
    // 9. WHY CHOOSE US
    // ==========================================

    public function indexWhyChooseUs(): JsonResponse
    {
        return response()->json(CmsWhyChooseUs::orderBy('sort_order')->get());
    }

    public function storeWhyChooseUs(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'icon' => 'nullable|string|max:100',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $item = CmsWhyChooseUs::create($validated);
        return response()->json($item, 201);
    }

    public function showWhyChooseUs(CmsWhyChooseUs $whyChooseUs): JsonResponse
    {
        return response()->json($whyChooseUs);
    }

    public function updateWhyChooseUs(Request $request, CmsWhyChooseUs $whyChooseUs): JsonResponse
    {
        $validated = $request->validate([
            'icon' => 'nullable|string|max:100',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $whyChooseUs->update($validated);
        return response()->json($whyChooseUs);
    }

    public function destroyWhyChooseUs(CmsWhyChooseUs $whyChooseUs): JsonResponse
    {
        $whyChooseUs->delete();
        return response()->json(['message' => 'Élément supprimé avec succès.']);
    }
}
