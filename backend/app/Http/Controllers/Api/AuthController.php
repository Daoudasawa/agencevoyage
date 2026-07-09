<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pelerin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouveau pèlerin.
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'nom'      => 'required|string|max:100',
            'prenom'   => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'telephone' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'nom'      => $data['nom'],
            'prenom'   => $data['prenom'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => 'pelerin',
            'active'   => true,
        ]);

        // Créer le profil pèlerin associé
        Pelerin::create([
            'user_id'   => $user->id,
            'telephone' => $data['telephone'] ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Compte créé avec succès.',
            'user'    => $this->formatUser($user),
            'token'   => $token,
        ], 201);
    }

    /**
     * Connexion (tous les rôles).
     */
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        if (!$user->active) {
            return response()->json([
                'message' => 'Votre compte est désactivé. Contactez l\'agence.',
                'error'   => 'ACCOUNT_DISABLED',
            ], 403);
        }

        // Révoque les anciens tokens, en crée un nouveau
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'user'    => $this->formatUser($user),
            'token'   => $token,
        ]);
    }

    /**
     * Déconnexion.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    /**
     * Profil de l'utilisateur connecté.
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('pelerin');
        return response()->json($this->formatUser($user));
    }

    private function formatUser(User $user): array
    {
        $data = [
            'id'     => $user->id,
            'nom'    => $user->nom,
            'prenom' => $user->prenom,
            'email'  => $user->email,
            'role'   => $user->role,
            'active' => $user->active,
        ];

        if ($user->role === 'pelerin' && $user->relationLoaded('pelerin')) {
            $data['pelerin'] = $user->pelerin;
        }

        return $data;
    }
}
