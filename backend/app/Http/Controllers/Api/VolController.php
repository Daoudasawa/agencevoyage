<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vol;
use Illuminate\Http\Request;

class VolController extends Controller
{
    public function index()
    {
        return response()->json(Vol::with('groupes')->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'compagnie'         => 'required|string|max:100',
            'numero_vol'        => 'required|string|unique:vols,numero_vol',
            'date_depart'       => 'required|date',
            'aeroport_depart'   => 'required|string|max:100',
            'aeroport_arrivee'  => 'required|string|max:100',
            'notes'             => 'nullable|string',
        ]);

        return response()->json(Vol::create($data), 201);
    }

    public function show(Vol $vol)
    {
        return response()->json($vol->load('groupes'));
    }

    public function update(Request $request, Vol $vol)
    {
        $data = $request->validate([
            'compagnie'        => 'sometimes|string|max:100',
            'numero_vol'       => 'sometimes|string|unique:vols,numero_vol,'.$vol->id,
            'date_depart'      => 'sometimes|date',
            'aeroport_depart'  => 'sometimes|string|max:100',
            'aeroport_arrivee' => 'sometimes|string|max:100',
            'notes'            => 'nullable|string',
        ]);

        $vol->update($data);
        return response()->json($vol);
    }

    public function destroy(Vol $vol)
    {
        if ($vol->groupes()->exists()) {
            return response()->json(['message' => 'Ce vol est utilisé par des groupes.'], 422);
        }
        $vol->delete();
        return response()->json(['message' => 'Vol supprimé.']);
    }
}
