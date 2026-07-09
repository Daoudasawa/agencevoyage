<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    public function index()
    {
        return response()->json(Hotel::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'     => 'required|string|max:200',
            'adresse' => 'nullable|string',
            'ville'   => 'required|in:La Mecque,Medine,Jeddah',
            'etoiles' => 'nullable|integer|min:1|max:5',
            'notes'   => 'nullable|string',
        ]);

        return response()->json(Hotel::create($data), 201);
    }

    public function show(Hotel $hotel)
    {
        return response()->json($hotel->load('groupes'));
    }

    public function update(Request $request, Hotel $hotel)
    {
        $data = $request->validate([
            'nom'     => 'sometimes|string|max:200',
            'adresse' => 'nullable|string',
            'ville'   => 'sometimes|in:La Mecque,Medine,Jeddah',
            'etoiles' => 'nullable|integer|min:1|max:5',
            'notes'   => 'nullable|string',
        ]);

        $hotel->update($data);
        return response()->json($hotel);
    }

    public function destroy(Hotel $hotel)
    {
        $hotel->delete();
        return response()->json(['message' => 'Hôtel supprimé.']);
    }
}
