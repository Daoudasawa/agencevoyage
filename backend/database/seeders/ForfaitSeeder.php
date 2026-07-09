<?php

namespace Database\Seeders;

use App\Models\Forfait;
use App\Models\TypeDocument;
use Illuminate\Database\Seeder;

class ForfaitSeeder extends Seeder
{
    public function run(): void
    {
        $forfaits = [
            [
                'nom' => 'Hajj 2026 Économique',
                'type' => 'hajj',
                'prix' => 2500000,
                'duree' => 30,
                'description' => 'Forfait Hajj économique tout compris. Hôtel catégorie standard à La Mecque et Médine. Transport aérien inclus.',
                'services_inclus' => 'Vol aller-retour, Hôtel, Repas, Transport local, Guide francophone, Assurance voyage',
                'actif' => true,
                'types_documents' => [
                    ['nom' => 'Copie du passeport', 'obligatoire' => true, 'description' => 'Passeport valide (expiration > 6 mois après la date de retour)'],
                    ['nom' => 'Photo d\'identité', 'obligatoire' => true, 'description' => 'Photo récente fond blanc, format 4x4 cm'],
                    ['nom' => 'Certificat de vaccination méningite', 'obligatoire' => true, 'description' => 'Vaccin méningocoque ACYW135 obligatoire'],
                    ['nom' => 'Certificat de vaccination Covid-19', 'obligatoire' => false, 'description' => 'Fortement recommandé'],
                    ['nom' => 'Extrait d\'acte de naissance', 'obligatoire' => true, 'description' => 'Ou jugement supplétif'],
                    ['nom' => 'Fiche d\'information médicale', 'obligatoire' => false, 'description' => 'Pour toute pathologie chronique'],
                ],
            ],
            [
                'nom' => 'Hajj 2026 Confort',
                'type' => 'hajj',
                'prix' => 3800000,
                'duree' => 30,
                'description' => 'Forfait Hajj confort avec hôtels 4 étoiles proches des lieux saints. Service premium.',
                'services_inclus' => 'Vol aller-retour business, Hôtel 4 étoiles, Pension complète, Transport privé, Guide dédié, Assurance tout risque, Kit pèlerin',
                'actif' => true,
                'types_documents' => [
                    ['nom' => 'Copie du passeport', 'obligatoire' => true, 'description' => 'Passeport valide'],
                    ['nom' => 'Photo d\'identité', 'obligatoire' => true, 'description' => 'Photo récente fond blanc'],
                    ['nom' => 'Certificat de vaccination méningite', 'obligatoire' => true, 'description' => 'Vaccin obligatoire'],
                    ['nom' => 'Extrait d\'acte de naissance', 'obligatoire' => true, 'description' => 'Ou jugement supplétif'],
                    ['nom' => 'Certificat médical', 'obligatoire' => true, 'description' => 'Aptitude au pèlerinage'],
                ],
            ],
            [
                'nom' => 'Omra Ramadan 2026',
                'type' => 'omra',
                'prix' => 1200000,
                'duree' => 15,
                'description' => 'Omra spécial Ramadan. Départ prévu 1er Ramadan 2026.',
                'services_inclus' => 'Vol aller-retour, Hôtel 3 étoiles, Repas, Transport, Guide',
                'actif' => true,
                'types_documents' => [
                    ['nom' => 'Copie du passeport', 'obligatoire' => true, 'description' => 'Passeport valide'],
                    ['nom' => 'Photo d\'identité', 'obligatoire' => true, 'description' => 'Photo récente fond blanc'],
                    ['nom' => 'Certificat de vaccination méningite', 'obligatoire' => true, 'description' => 'Vaccin obligatoire'],
                ],
            ],
            [
                'nom' => 'Omra Hors Saison 2026',
                'type' => 'omra',
                'prix' => 900000,
                'duree' => 10,
                'description' => 'Omra hors saison à tarif avantageux. Idéal pour une première visite.',
                'services_inclus' => 'Vol aller-retour, Hôtel, Repas, Transport',
                'actif' => true,
                'types_documents' => [
                    ['nom' => 'Copie du passeport', 'obligatoire' => true, 'description' => 'Passeport valide'],
                    ['nom' => 'Photo d\'identité', 'obligatoire' => true, 'description' => 'Photo récente fond blanc'],
                    ['nom' => 'Certificat de vaccination méningite', 'obligatoire' => true, 'description' => 'Vaccin obligatoire'],
                ],
            ],
        ];

        foreach ($forfaits as $data) {
            $typesData = $data['types_documents'];
            unset($data['types_documents']);
            
            $forfait = Forfait::create($data);

            foreach ($typesData as $type) {
                TypeDocument::create(array_merge($type, ['forfait_id' => $forfait->id]));
            }
        }
    }
}
