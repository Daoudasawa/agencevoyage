<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Forfait;
use App\Models\CmsSection;
use App\Models\CmsService;
use App\Models\CmsTestimonial;
use App\Models\CmsGallery;
use App\Models\CmsBlogPost;
use App\Models\CmsFaq;
use App\Models\CmsContactInfo;
use App\Models\CmsDeparture;
use App\Models\CmsWhyChooseUs;
use Illuminate\Database\Seeder;

class CmsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. CmsSection
        CmsSection::create([
            'key' => 'hero',
            'title' => 'Votre Pèlerinage de Rêve avec Hajj Omra BF',
            'subtitle' => 'L\'agence de confiance au Burkina Faso pour vous accompagner vers la Terre Sainte',
            'content' => [
                'badge' => 'Hajj & Omra 2026',
                'cta_text' => 'Découvrir nos offres',
                'cta_link' => '/forfaits',
                'features' => [
                    'Accompagnement personnalisé',
                    'Hôtels proches des Lieux Saints',
                    'Guides spirituels certifiés'
                ]
            ],
            'media_url' => 'images/hero-hajj.jpg',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        CmsSection::create([
            'key' => 'stats',
            'title' => 'Notre agence en quelques chiffres',
            'subtitle' => 'Des années d\'expérience à votre entière disposition',
            'content' => [
                'stats' => [
                    ['label' => 'Pèlerins accompagnés', 'value' => '10 000+'],
                    ['label' => 'Années d\'expérience', 'value' => '15+'],
                    ['label' => 'Taux de satisfaction', 'value' => '98%'],
                    ['label' => 'Guides spirituels', 'value' => '25+'],
                ]
            ],
            'media_url' => null,
            'sort_order' => 2,
            'is_active' => true,
        ]);

        CmsSection::create([
            'key' => 'about',
            'title' => 'Qui sommes-nous ?',
            'subtitle' => 'Hajj Omra BF, votre partenaire de confiance depuis Ouagadougou',
            'content' => [
                'text' => 'Depuis plus de 15 ans, notre agence de voyages facilite le pèlerinage pour les fidèles burkinabè. Nous gérons toutes les démarches administratives, l\'hébergement, les vols et offrons un encadrement religieux et médical de qualité supérieure pour que vous accomplissiez vos rites en toute sérénité.',
                'cta_text' => 'En savoir plus',
                'cta_link' => '/a-propos',
            ],
            'media_url' => 'images/about-mosque.jpg',
            'sort_order' => 3,
            'is_active' => true,
        ]);

        // 2. CmsService
        $services = [
            [
                'icon' => 'airplane',
                'title' => 'Vols Directs & Sécurisés',
                'description' => 'Partenariats avec des compagnies aériennes de premier plan pour des vols confortables depuis Ouagadougou jusqu\'à Djeddah ou Médine.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'icon' => 'hotel',
                'title' => 'Hôtels Proches des Lieux Saints',
                'description' => 'Une sélection d\'hôtels de qualité situés à quelques minutes de marche de la Mosquée al-Haram à La Mecque et de la Mosquée du Prophète à Médine.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'icon' => 'users',
                'title' => 'Accompagnement Spirituel & Médical',
                'description' => 'Des guides religieux qualifiés et des médecins accompagnent chaque groupe pour assurer le bien-être spirituel et physique des pèlerins.',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'icon' => 'clipboard-list',
                'title' => 'Formalités Administratives Intégrales',
                'description' => 'Nous nous chargeons de l\'obtention des visas, de la validation des documents et des assurances obligatoires.',
                'sort_order' => 4,
                'is_active' => true,
            ]
        ];

        foreach ($services as $srv) {
            CmsService::create($srv);
        }

        // 3. CmsTestimonial
        $testimonials = [
            [
                'name' => 'El Hadj Ousmane Sawadogo',
                'country' => 'Burkina Faso (Ouagadougou)',
                'photo' => 'images/testimonials/ousmane.jpg',
                'review' => 'Une organisation impeccable du début à la fin. Les guides religieux ont été d\'une grande aide pour nous expliquer chaque rite. Je recommande vivement cette agence.',
                'rating' => 5,
                'status' => 'published',
                'sort_order' => 1,
            ],
            [
                'name' => 'Hadja Fatoumata Diallo',
                'country' => 'Burkina Faso (Bobo-Dioulasso)',
                'photo' => 'images/testimonials/fatoumata.jpg',
                'review' => 'Hôtels très propres et proches de la mosquée de Médine. L\'assistance médicale sur place a été très réactive lorsque j\'ai eu un coup de fatigue.',
                'rating' => 5,
                'status' => 'published',
                'sort_order' => 2,
            ],
            [
                'name' => 'Mamadou Traoré',
                'country' => 'Burkina Faso (Koudougou)',
                'photo' => 'images/testimonials/mamadou.jpg',
                'review' => 'Excellent rapport qualité-prix pour la Omra Ramadan. L\'équipe a été très professionnelle et patiente. Un grand merci à toute l\'équipe.',
                'rating' => 4,
                'status' => 'published',
                'sort_order' => 3,
            ]
        ];

        foreach ($testimonials as $tst) {
            CmsTestimonial::create($tst);
        }

        // 4. CmsGallery
        $gallery = [
            [
                'image_path' => 'images/gallery/kaaba.jpg',
                'caption' => 'Le Tawaf autour de la sainte Kaaba',
                'category' => 'Lieux Saints',
                'album' => 'Hajj 2025',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'image_path' => 'images/gallery/medine.jpg',
                'caption' => 'La Mosquée du Prophète à Médine',
                'category' => 'Lieux Saints',
                'album' => 'Hajj 2025',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'image_path' => 'images/gallery/mina.jpg',
                'caption' => 'Les tentes de Mina sous le coucher du soleil',
                'category' => 'Rites',
                'album' => 'Hajj 2025',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'image_path' => 'images/gallery/depart-ouaga.jpg',
                'caption' => 'Départ joyeux de nos pèlerins à l\'aéroport de Ouagadougou',
                'category' => 'Départ',
                'album' => 'Hajj 2025',
                'sort_order' => 4,
                'is_active' => true,
            ]
        ];

        foreach ($gallery as $gal) {
            CmsGallery::create($gal);
        }

        // 5. CmsBlogPost
        $admin = User::where('role', 'admin')->first();
        $adminId = $admin ? $admin->id : 1;

        $posts = [
            [
                'title' => 'Comment bien se préparer spirituellement au Hajj',
                'slug' => 'comment-bien-se-preparer-spirituellement-au-hajj',
                'excerpt' => 'Le pèlerinage à La Mecque est le voyage d\'une vie. Découvrez les étapes essentielles pour y préparer votre cœur et votre esprit.',
                'content' => 'Le Hajj n\'est pas seulement un voyage physique, c\'est avant tout un cheminement spirituel profond. Il est recommandé de multiplier les prières, de demander pardon à ses proches et d\'étudier en détail les rites à accomplir. Dans ce guide pratique, nous vous proposons une série d\'invocations et de conseils spirituels à lire avant votre grand départ de Ouagadougou.',
                'image' => 'images/blog/preparation-hajj.jpg',
                'author_id' => $adminId,
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'title' => 'Les exigences de visa Hajj & Omra pour les Burkinabè en 2026',
                'slug' => 'les-exigences-de-visa-hajj-omra-pour-les-burkinabe-en-2026',
                'excerpt' => 'Découvrez la liste complète des documents requis et les nouveautés administratives pour obtenir votre visa de pèlerinage.',
                'content' => 'Pour l\'année 2026, les autorités saoudiennes ont mis en place de nouvelles régulations pour simplifier les demandes de visa en ligne. Pour les résidents et citoyens du Burkina Faso, il est impératif de détenir un passeport valide au moins 6 mois après le retour, ainsi qu\'un certificat de vaccination contre la méningite. Notre agence prend en charge l\'ensemble de ces formalités pour vous garantir un départ sans stress.',
                'image' => 'images/blog/visa-2026.jpg',
                'author_id' => $adminId,
                'status' => 'published',
                'published_at' => now()->subDays(2),
            ]
        ];

        foreach ($posts as $pst) {
            CmsBlogPost::create($pst);
        }

        // 6. CmsFaq
        $faqs = [
            [
                'question' => 'Quels sont les vaccins obligatoires pour le Hajj ?',
                'answer' => 'Le vaccin contre la méningite à méningocoques (ACYW135) est obligatoire pour obtenir le visa Hajj ou Omra et doit être administré au moins 10 jours avant le départ. Le vaccin contre la Covid-19 et la grippe saisonnière sont également recommandés.',
                'category' => 'Santé',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'question' => 'Combien de bagages puis-je emporter ?',
                'answer' => 'En général, les compagnies aériennes partenaires autorisent 2 valises de 23 kg en soute par pèlerin, et 1 bagage à main de 7 kg en cabine. Un bidon d\'eau de Zamzam (5 litres) est habituellement fourni à l\'aéroport de retour gratuitement.',
                'category' => 'Logistique',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'question' => 'Puis-je payer mon forfait Hajj en plusieurs versements ?',
                'answer' => 'Oui, nous proposons des facilités de paiement. Un premier acompte est demandé à l\'inscription pour réserver votre place, et le solde restant peut être payé en plusieurs fois. La totalité du forfait doit impérativement être réglée au moins 30 jours avant le départ.',
                'category' => 'Paiement',
                'sort_order' => 3,
                'is_active' => true,
            ]
        ];

        foreach ($faqs as $faq) {
            CmsFaq::create($faq);
        }

        // 7. CmsContactInfo
        $contacts = [
            'phone_1' => '+226 25 30 00 00',
            'phone_2' => '+226 70 00 00 00',
            'email' => 'contact@hajjomra.bf',
            'address' => 'Avenue Kwamé N\'Krumah, Secteur 3, Ouagadougou, Burkina Faso',
            'office_hours' => 'Lundi - Vendredi : 08h00 - 17h30 | Samedi : 08h00 - 12h00',
            'google_map_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3897.2341359141077!2d-1.5244588!3d12.3688849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDIyJzA4LjAiTiAxwrAzMScyOC4wIlc!5e0!3m2!1sfr!2sbf!4v1620000000000!5m2!1sfr!2sbf'
        ];

        foreach ($contacts as $k => $v) {
            CmsContactInfo::create([
                'key' => $k,
                'value' => $v,
            ]);
        }

        // 8. CmsDeparture
        $forfaitEco = Forfait::where('nom', 'like', '%Économique%')->first();
        $forfaitConf = Forfait::where('nom', 'like', '%Confort%')->first();
        $forfaitRamadan = Forfait::where('nom', 'like', '%Ramadan%')->first();
        $forfaitHorsSaison = Forfait::where('nom', 'like', '%Hors Saison%')->first();

        CmsDeparture::create([
            'date' => '2026-10-15',
            'type' => 'hajj',
            'forfait_id' => $forfaitEco ? $forfaitEco->id : null,
            'places_total' => 100,
            'places_remaining' => 45,
            'price' => 2500000,
            'is_active' => true,
        ]);

        CmsDeparture::create([
            'date' => '2026-10-16',
            'type' => 'hajj',
            'forfait_id' => $forfaitConf ? $forfaitConf->id : null,
            'places_total' => 50,
            'places_remaining' => 12,
            'price' => 3800000,
            'is_active' => true,
        ]);

        CmsDeparture::create([
            'date' => '2026-03-01',
            'type' => 'omra',
            'forfait_id' => $forfaitRamadan ? $forfaitRamadan->id : null,
            'places_total' => 80,
            'places_remaining' => 8,
            'price' => 1200000,
            'is_active' => true,
        ]);

        CmsDeparture::create([
            'date' => '2026-05-10',
            'type' => 'omra',
            'forfait_id' => $forfaitHorsSaison ? $forfaitHorsSaison->id : null,
            'places_total' => 60,
            'places_remaining' => 30,
            'price' => 900000,
            'is_active' => true,
        ]);

        // 9. CmsWhyChooseUs
        $whyUs = [
            [
                'icon' => 'award',
                'title' => 'Agrément Officiel de l\'État',
                'description' => 'Notre agence est officiellement agréée par le Ministère de l\'Administration Territoriale et de la Sécurité du Burkina Faso pour l\'organisation du Hajj et de la Omra.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'icon' => 'shield-check',
                'title' => 'Transparence & Sécurité',
                'description' => 'Aucun frais caché. Tous les tarifs présentés sont clairs et font l\'objet d\'un contrat écrit détaillé pour sécuriser votre investissement spirituel.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'icon' => 'heart',
                'title' => 'Service Centré sur le Pèlerin',
                'description' => 'Nous plaçons l\'humain au cœur de nos préoccupations. Notre équipe est particulièrement à l\'écoute des aînés et des personnes ayant des besoins de santé spécifiques.',
                'sort_order' => 3,
                'is_active' => true,
            ]
        ];

        foreach ($whyUs as $wy) {
            CmsWhyChooseUs::create($wy);
        }
    }
}
