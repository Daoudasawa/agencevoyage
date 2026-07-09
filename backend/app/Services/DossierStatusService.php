<?php

namespace App\Services;

use App\Models\Inscription;

class DossierStatusService
{
    /**
     * Calcule et met à jour automatiquement le statut d'un dossier (RG3).
     * Un dossier est 'valide' si :
     *  - Tous les types_documents obligatoires du forfait ont statut 'valide'
     *  - La somme des paiements validés = prix du forfait
     *  - Le pèlerin est affecté à un groupe
     */
    public function calculer(Inscription $inscription): string
    {
        $inscription->load(['pelerin.documents', 'pelerin.paiements', 'pelerin.groupe', 'forfait.typesDocuments']);

        $pelerin = $inscription->pelerin;
        $forfait = $inscription->forfait;

        // Vérifier si l'inscription est désistée
        if ($inscription->statut === 'desiste') {
            return 'desiste';
        }

        // RG3 critère 1 : tous les documents obligatoires validés
        $typesObligatoires = $forfait->typesDocuments->where('obligatoire', true);
        $documentsValides = $pelerin->documents->where('statut', 'valide')->pluck('type_document_id');
        $tousDocsOk = $typesObligatoires->every(fn($type) => $documentsValides->contains($type->id));

        // RG3 critère 2 : paiement total soldé
        $totalPaye = $pelerin->paiements->where('statut', 'valide')->sum('montant');
        $paiementSolde = $totalPaye >= $forfait->prix;

        // RG3 critère 3 : affecté à un groupe
        $groupeAssigne = !is_null($pelerin->groupe_id);

        if ($tousDocsOk && $paiementSolde && $groupeAssigne) {
            return 'valide';
        }

        // Déterminer si en cours de vérification (au moins un doc soumis)
        $hasDocsSoumis = $pelerin->documents->where('statut', 'soumis')->isNotEmpty();
        $hasPaiements = $pelerin->paiements->isNotEmpty();

        if ($hasDocsSoumis || $hasPaiements) {
            return 'en_verification';
        }

        return 'incomplet';
    }

    /**
     * Recalcule et sauvegarde le statut de l'inscription.
     */
    public function appliquer(Inscription $inscription): void
    {
        $nouveauStatut = $this->calculer($inscription);
        if ($inscription->statut !== 'desiste') {
            $inscription->update(['statut' => $nouveauStatut]);
        }
    }
}
