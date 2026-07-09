<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use App\Services\DossierStatusService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaiementController extends Controller
{
    public function __construct(private DossierStatusService $statusService) {}

    /**
     * Pèlerin déclare un paiement.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'montant'       => 'required|integer|min:1',
            'date_paiement' => 'required|date',
            'mode_paiement' => 'required|in:especes,orange_money,moov_money,virement',
            'reference'     => 'nullable|string|max:100|unique:paiements,reference',
            'notes'         => 'nullable|string|max:500',
        ]);

        $pelerin = $request->user()->pelerin;
        $inscription = $pelerin?->inscriptionActive;

        if (!$inscription) {
            return response()->json(['message' => 'Aucune inscription active.'], 422);
        }

        // Générer une référence si non fournie
        if (empty($data['reference'])) {
            $data['reference'] = 'REF-' . strtoupper(Str::random(10));
        }

        $paiement = Paiement::create(array_merge($data, [
            'pelerin_id'    => $pelerin->id,
            'inscription_id' => $inscription->id,
            'statut'        => 'en_attente',
        ]));

        return response()->json([
            'message'  => 'Paiement déclaré. En attente de validation par un agent.',
            'paiement' => $paiement,
        ], 201);
    }

    /**
     * Pèlerin voit ses paiements.
     */
    public function index(Request $request)
    {
        $pelerin = $request->user()->pelerin;
        $paiements = $pelerin->paiements()->latest()->get();

        return response()->json([
            'paiements'     => $paiements,
            'total_paye'    => $pelerin->getTotalPaye(),
            'solde_restant' => $pelerin->inscriptionActive?->getSoldeRestant() ?? 0,
        ]);
    }

    /**
     * Agent/Admin : liste tous les paiements.
     */
    public function adminIndex(Request $request)
    {
        $query = Paiement::with(['pelerin.user', 'enregistrePar'])->latest();

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }
        if ($request->filled('mode_paiement')) {
            $query->where('mode_paiement', $request->mode_paiement);
        }

        return response()->json($query->paginate(20));
    }

    /**
     * Agent valide un paiement (RG5 : définitif).
     */
    public function valider(Request $request, Paiement $paiement)
    {
        if ($paiement->statut !== 'en_attente') {
            return response()->json(['message' => 'Ce paiement ne peut plus être validé.'], 422);
        }

        $paiement->update([
            'statut'        => 'valide',
            'enregistre_par' => $request->user()->id,
            'valide_le'     => now(),
        ]);

        // RG3 : recalculer statut du dossier
        $inscription = $paiement->inscription;
        $this->statusService->appliquer($inscription);

        return response()->json([
            'message'  => 'Paiement validé.',
            'paiement' => $paiement->fresh('enregistrePar'),
        ]);
    }

    /**
     * Agent annule un paiement.
     */
    public function annuler(Request $request, Paiement $paiement)
    {
        if ($paiement->statut === 'valide') {
            return response()->json(['message' => 'Un paiement validé ne peut pas être annulé.'], 422);
        }

        $paiement->update(['statut' => 'annule']);

        return response()->json(['message' => 'Paiement annulé.']);
    }
}
