<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pelerin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PelerinController extends Controller
{
    public function index(Request $request)
    {
        $query = Pelerin::with(['user', 'groupe', 'inscriptionActive.forfait', 'paiements'])
            ->latest();

        if ($request->filled('search')) {
            $query->whereHas('user', fn($q) =>
                $q->where('nom', 'like', '%'.$request->search.'%')
                  ->orWhere('prenom', 'like', '%'.$request->search.'%')
                  ->orWhere('email', 'like', '%'.$request->search.'%')
            );
        }

        if ($request->filled('groupe_id')) {
            $query->where('groupe_id', $request->groupe_id);
        }

        if ($request->filled('statut')) {
            $query->whereHas('inscriptionActive', fn($q) =>
                $q->where('statut', $request->statut)
            );
        }

        if ($request->filled('forfait_type')) {
            $query->whereHas('inscriptionActive.forfait', fn($q) =>
                $q->where('type', $request->forfait_type)
            );
        }

        return response()->json($query->paginate(20));
    }

    public function show(Pelerin $pelerin)
    {
        return response()->json(
            $pelerin->load([
                'user',
                'groupe.vol',
                'groupe.hotels',
                'inscriptionActive.forfait.typesDocuments',
                'documents.typeDocument',
                'paiements',
            ])
        );
    }

    /**
     * Agent crée un dossier manuellement (pèlerin se présente en agence).
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'               => 'required|string|max:100',
            'prenom'            => 'required|string|max:100',
            'email'             => 'required|email|unique:users,email',
            'telephone'         => 'nullable|string|max:20',
            'adresse'           => 'nullable|string',
            'profession'        => 'nullable|string|max:100',
            'numero_passeport'  => 'nullable|string|unique:pelerins,numero_passeport',
            'nationalite'       => 'nullable|string|max:100',
            'date_naissance'    => 'nullable|date',
            'forfait_id'        => 'nullable|exists:forfaits,id',
        ]);

        $user = User::create([
            'nom'      => $data['nom'],
            'prenom'   => $data['prenom'],
            'email'    => $data['email'],
            'password' => Hash::make(str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT)),
            'role'     => 'pelerin',
            'active'   => true,
        ]);

        $pelerin = Pelerin::create([
            'user_id'          => $user->id,
            'telephone'        => $data['telephone'] ?? null,
            'adresse'          => $data['adresse'] ?? null,
            'profession'       => $data['profession'] ?? null,
            'numero_passeport' => $data['numero_passeport'] ?? null,
            'nationalite'      => $data['nationalite'] ?? 'Burkinabè',
            'date_naissance'   => $data['date_naissance'] ?? null,
        ]);

        return response()->json([
            'message' => 'Dossier créé avec succès.',
            'pelerin' => $pelerin->load('user'),
        ], 201);
    }

    public function update(Request $request, Pelerin $pelerin)
    {
        $data = $request->validate([
            'telephone'        => 'nullable|string|max:20',
            'adresse'          => 'nullable|string',
            'profession'       => 'nullable|string|max:100',
            'numero_passeport' => 'nullable|string|unique:pelerins,numero_passeport,'.$pelerin->id,
            'nationalite'      => 'nullable|string|max:100',
            'date_naissance'   => 'nullable|date',
        ]);

        $pelerin->update($data);
        return response()->json($pelerin->fresh('user'));
    }
}
