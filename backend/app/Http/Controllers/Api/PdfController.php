<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Groupe;
use App\Models\Paiement;
use App\Models\Pelerin;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PdfController extends Controller
{
    /**
     * Reçu de paiement (pèlerin ou agent).
     */
    public function recu(Request $request, Paiement $paiement)
    {
        // Sécurité : le pèlerin ne voit que son propre reçu
        if ($request->user()->role === 'pelerin') {
            $pelerin = $request->user()->pelerin;
            if ($paiement->pelerin_id !== $pelerin?->id) {
                return response()->json(['message' => 'Accès refusé.'], 403);
            }
        }

        if ($paiement->statut !== 'valide') {
            return response()->json(['message' => 'Le reçu n\'est disponible qu\'après validation.'], 422);
        }

        $paiement->load(['pelerin.user', 'inscription.forfait', 'enregistrePar']);
        $pdf = Pdf::loadView('pdf.recu-paiement', ['paiement' => $paiement]);

        return $pdf->download('recu-' . $paiement->reference . '.pdf');
    }

    /**
     * Fiche récapitulative du pèlerin (agent/admin).
     */
    public function fichePelerin(Pelerin $pelerin)
    {
        $pelerin->load([
            'user', 'groupe.vol', 'groupe.hotels',
            'inscriptionActive.forfait.typesDocuments',
            'documents.typeDocument',
            'paiements',
        ]);

        $pdf = Pdf::loadView('pdf.fiche-pelerin', ['pelerin' => $pelerin]);
        return $pdf->download('fiche-' . $pelerin->numero_passeport . '.pdf');
    }

    /**
     * Liste d'émargement du groupe.
     */
    public function listeEmargement(Groupe $groupe)
    {
        $groupe->load(['pelerins.user', 'pelerins.inscriptionActive.forfait', 'vol', 'hotels']);
        $pdf = Pdf::loadView('pdf.liste-emargement', ['groupe' => $groupe]);
        return $pdf->download('emargement-' . $groupe->nom . '.pdf');
    }
}
