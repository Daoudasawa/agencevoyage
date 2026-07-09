<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Forfait;
use Illuminate\Http\Request;

class ForfaitController extends Controller
{
    public function index(Request $request)
    {
        $query = Forfait::with('typesDocuments');

        // Pelerins ne voient que les forfaits actifs
        if ($request->user()->role === 'pelerin') {
            $query->actif();
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->orderBy('type')->orderBy('prix')->get());
    }

    public function show(Forfait $forfait)
    {
        return response()->json($forfait->load('typesDocuments'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'              => 'required|string|max:200',
            'type'             => 'required|in:hajj,omra',
            'prix'             => 'required|integer|min:1',
            'duree'            => 'required|integer|min:1',
            'description'      => 'nullable|string',
            'services_inclus'  => 'nullable|string',
            'actif'            => 'boolean',
        ]);

        $forfait = Forfait::create($data);
        return response()->json($forfait, 201);
    }

    public function update(Request $request, Forfait $forfait)
    {
        $data = $request->validate([
            'nom'             => 'sometimes|string|max:200',
            'type'            => 'sometimes|in:hajj,omra',
            'prix'            => 'sometimes|integer|min:1',
            'duree'           => 'sometimes|integer|min:1',
            'description'     => 'nullable|string',
            'services_inclus' => 'nullable|string',
            'actif'           => 'boolean',
        ]);

        $forfait->update($data);
        return response()->json($forfait->fresh('typesDocuments'));
    }

    public function destroy(Forfait $forfait)
    {
        // Désactiver plutôt que supprimer si inscriptions existent
        if ($forfait->inscriptions()->exists()) {
            $forfait->update(['actif' => false]);
            return response()->json(['message' => 'Forfait désactivé (inscriptions existantes).']);
        }

        $forfait->delete();
        return response()->json(['message' => 'Forfait supprimé.']);
    }
}
