<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Groupe;
use App\Models\Pelerin;
use App\Services\DossierStatusService;
use Illuminate\Http\Request;

class GroupeController extends Controller
{
    public function __construct(private DossierStatusService $statusService) {}

    public function index()
    {
        $groupes = Groupe::with(['vol', 'hotels'])
            ->withCount('pelerins')
            ->get()
            ->map(fn($g) => array_merge($g->toArray(), [
                'places_restantes' => $g->getPlacesRestantes(),
            ]));

        return response()->json($groupes);
    }

    public function show(Groupe $groupe)
    {
        return response()->json(
            $groupe->load(['vol', 'hotels', 'pelerins.user', 'pelerins.inscriptionActive.forfait'])
                   ->append([])
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'          => 'required|string|max:200',
            'vol_id'       => 'required|exists:vols,id',
            'date_depart'  => 'required|date',
            'date_retour'  => 'required|date|after:date_depart',
            'capacite_max' => 'required|integer|min:1',
            'hotel_ids'    => 'nullable|array',
            'hotel_ids.*'  => 'exists:hotels,id',
            'notes'        => 'nullable|string',
        ]);

        $groupe = Groupe::create($data);

        if (!empty($data['hotel_ids'])) {
            $groupe->hotels()->attach($data['hotel_ids']);
        }

        return response()->json($groupe->load(['vol', 'hotels']), 201);
    }

    public function update(Request $request, Groupe $groupe)
    {
        $data = $request->validate([
            'nom'          => 'sometimes|string|max:200',
            'vol_id'       => 'sometimes|exists:vols,id',
            'date_depart'  => 'sometimes|date',
            'date_retour'  => 'sometimes|date',
            'capacite_max' => 'sometimes|integer|min:1',
            'hotel_ids'    => 'nullable|array',
            'hotel_ids.*'  => 'exists:hotels,id',
            'notes'        => 'nullable|string',
        ]);

        $groupe->update($data);

        if (isset($data['hotel_ids'])) {
            $groupe->hotels()->sync($data['hotel_ids']);
        }

        return response()->json($groupe->fresh(['vol', 'hotels']));
    }

    /**
     * Ajouter un ou plusieurs pèlerins au groupe (avec vérification capacité).
     */
    public function ajouterPelerin(Request $request, Groupe $groupe)
    {
        $data = $request->validate([
            'pelerin_ids'   => 'required|array|min:1',
            'pelerin_ids.*' => 'exists:pelerins,id',
        ]);

        $placesRestantes = $groupe->getPlacesRestantes();
        if (count($data['pelerin_ids']) > $placesRestantes) {
            return response()->json([
                'message' => "Capacité insuffisante. Places restantes : {$placesRestantes}.",
                'error'   => 'CAPACITE_INSUFFISANTE',
            ], 422);
        }

        foreach ($data['pelerin_ids'] as $pelerinId) {
            $pelerin = Pelerin::find($pelerinId);
            if ($pelerin) {
                $pelerin->update(['groupe_id' => $groupe->id]);

                // RG3 : recalculer statut
                $inscription = $pelerin->inscriptionActive;
                if ($inscription) {
                    $this->statusService->appliquer($inscription);
                }
            }
        }

        return response()->json([
            'message' => count($data['pelerin_ids']) . ' pèlerin(s) ajouté(s) au groupe.',
            'groupe'  => $groupe->fresh(['pelerins.user']),
        ]);
    }

    /**
     * Retirer un pèlerin du groupe.
     */
    public function retirerPelerin(Groupe $groupe, Pelerin $pelerin)
    {
        if ($pelerin->groupe_id !== $groupe->id) {
            return response()->json(['message' => 'Ce pèlerin n\'est pas dans ce groupe.'], 422);
        }

        $pelerin->update(['groupe_id' => null]);

        $inscription = $pelerin->inscriptionActive;
        if ($inscription) {
            $this->statusService->appliquer($inscription);
        }

        return response()->json(['message' => 'Pèlerin retiré du groupe.']);
    }

    /**
     * Liste des pèlerins du groupe (pour export / émargement).
     */
    public function liste(Groupe $groupe)
    {
        $groupe->load(['pelerins.user', 'pelerins.inscriptionActive.forfait', 'vol', 'hotels']);
        return response()->json($groupe);
    }
}
