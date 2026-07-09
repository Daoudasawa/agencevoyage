<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Forfait;
use App\Models\Inscription;
use App\Services\DossierStatusService;
use Illuminate\Http\Request;

class InscriptionController extends Controller
{
    public function __construct(private DossierStatusService $statusService) {}

    /**
     * Le pèlerin s'inscrit à un forfait (RG1 : une seule inscription active).
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'forfait_id' => 'required|exists:forfaits,id',
        ]);

        $pelerin = $request->user()->pelerin;

        if (!$pelerin) {
            return response()->json(['message' => 'Profil pèlerin introuvable.'], 404);
        }

        // RG1 : vérifier qu'il n'a pas déjà une inscription active
        $inscriptionActive = $pelerin->inscriptions()
            ->whereNotIn('statut', ['desiste'])
            ->exists();

        if ($inscriptionActive) {
            return response()->json([
                'message' => 'Vous avez déjà une inscription active. Impossible de s\'inscrire à un autre forfait.',
                'error'   => 'INSCRIPTION_EXISTANTE',
            ], 422);
        }

        $forfait = Forfait::findOrFail($data['forfait_id']);
        if (!$forfait->actif) {
            return response()->json(['message' => 'Ce forfait n\'est plus disponible.'], 422);
        }

        $inscription = Inscription::create([
            'pelerin_id'       => $pelerin->id,
            'forfait_id'       => $forfait->id,
            'statut'           => 'incomplet',
            'date_inscription' => now(),
        ]);

        return response()->json([
            'message'     => 'Inscription créée. Veuillez déposer vos documents.',
            'inscription' => $inscription->load('forfait'),
        ], 201);
    }

    /**
     * Le pèlerin consulte son dossier.
     */
    public function monDossier(Request $request)
    {
        $pelerin = $request->user()->pelerin;
        if (!$pelerin) {
            return response()->json(['message' => 'Profil introuvable.'], 404);
        }

        $inscription = $pelerin->inscriptionActive;
        if (!$inscription) {
            return response()->json(['message' => 'Aucune inscription active.'], 404);
        }

        $inscription->load(['forfait.typesDocuments', 'paiements']);

        // Charger les paiements liés à cette inscription sur le pelerin aussi
        // pour que le frontend puisse les lire via pelerin.paiements
        $pelerin->load(['documents.typeDocument', 'groupe.vol', 'groupe.hotels', 'paiements']);

        return response()->json([
            'inscription'    => $inscription,
            'solde_restant'  => $inscription->getSoldeRestant(),
            'total_paye'     => $pelerin->getTotalPaye(),
            'pelerin'        => $pelerin,
        ]);
    }

    /**
     * Agent/Admin : liste toutes les inscriptions.
     */
    public function index(Request $request)
    {
        $query = Inscription::with(['pelerin.user', 'forfait'])
            ->latest();

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }
        if ($request->filled('forfait_type')) {
            $query->whereHas('forfait', fn($q) => $q->where('type', $request->forfait_type));
        }
        if ($request->filled('search')) {
            $query->whereHas('pelerin.user', fn($q) =>
                $q->where('nom', 'like', '%'.$request->search.'%')
                  ->orWhere('prenom', 'like', '%'.$request->search.'%')
                  ->orWhere('email', 'like', '%'.$request->search.'%')
            );
        }

        return response()->json($query->paginate(20));
    }

    public function show(Inscription $inscription)
    {
        return response()->json(
            $inscription->load(['pelerin.user', 'forfait.typesDocuments', 'paiements'])
        );
    }

    /**
     * Agent change le statut d'une inscription.
     */
    public function updateStatut(Request $request, Inscription $inscription)
    {
        $data = $request->validate([
            'statut'            => 'required|in:incomplet,en_verification,valide,desiste',
            'commentaire_agent' => 'nullable|string|max:500',
        ]);

        $inscription->update($data);

        return response()->json([
            'message'     => 'Statut mis à jour.',
            'inscription' => $inscription->fresh(['pelerin.user', 'forfait']),
        ]);
    }
}
